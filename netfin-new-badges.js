/* NetFin New Badges — Netflix-style "Recently added" / "New Season" /
   "New Episode | Watch Now" badges.
   Paste into Dashboard → Plugins → JavaScript Injector as a new script named
   "NetFin New Badges" (enabled, runs on all pages). Styled by C19–C21 in
   netfin-jf12.css; this script only adds <div class="netfin-newBadge">.

   "Added" = Jellyfin's Date Added (DateCreated).
   "Aired" = the item's PremiereDate (air date). Used so that old content
   you only just downloaded (a finished show, a backfilled season or old
   episodes) is not called "new". Items with no air date count as aired.

   Show / movie cards (strongest wins):
   1. New Season     – a season 2+ added in DAYS_SEASON days that also
                       aired in the last AIR_DAYS_SEASON days
                       (even if the whole show is new to your library)
   2. Recently added – movie or show added in DAYS_MOVIE / DAYS_SERIES days
   3. New Episode    – show has an unwatched episode that was added in
                       DAYS_EPISODE days and aired in AIR_DAYS_EPISODE days
   Episode cards (Continue Watching, Next Up, Recently Aired):
   - New Episode | Watch Now – same episode rule as 3. */
(function () {
  'use strict';
  if (window.__netfinNewBadges) return;
  window.__netfinNewBadges = true;

  /* ── Settings ── */
  var DAYS_MOVIE = 14;
  var DAYS_SERIES = 14;
  var DAYS_SEASON = 14;
  var DAYS_EPISODE = 7;
  var AIR_DAYS_SEASON = 60;      /* season premiered this recently = "new" */
  var AIR_DAYS_EPISODE = 14;     /* episode aired this recently = "new" */
  var REFRESH_MINUTES = 15;
  var LABEL_ADDED = 'Recently added';
  var LABEL_SEASON = 'New Season';
  var LABEL_EPISODE = 'New Episode';
  var LABEL_WATCH = 'Watch Now';      /* white half, New Episode only ('' = off) */

  var badgeById = new Map();
  var loadedAt = 0;
  var loading = null;
  var loadedFor = '';
  var timer = null;

  function client() { return window.ApiClient; }

  function fetchRecent(type, days, limit) {
    var c = client();
    var q = {
      IncludeItemTypes: type,
      Recursive: true,
      SortBy: 'DateCreated',
      SortOrder: 'Descending',
      Fields: 'DateCreated',
      Limit: limit,
      EnableImages: false,
      EnableUserData: true,
      EnableTotalRecordCount: false
    };
    /* Skip placeholder ("missing") episodes/seasons Jellyfin creates from
       metadata for upcoming air dates: there is nothing to watch yet. */
    if (type === 'Episode' || type === 'Season') q.IsMissing = false;
    return c.getItems(c.getCurrentUserId(), q).then(function (res) {
      var min = Date.now() - days * 864e5;
      return ((res && res.Items) || []).filter(function (item) {
        if (item.LocationType === 'Virtual') return false;   /* belt and braces */
        return item.DateCreated && Date.parse(item.DateCreated) >= min;
      });
    });
  }

  function load() {
    if (loading) return loading;
    var user = client().getCurrentUserId();
    if (user !== loadedFor) { loadedAt = 0; badgeById = new Map(); }   /* user switched */
    if (loadedAt && Date.now() - loadedAt < REFRESH_MINUTES * 6e4) return Promise.resolve();
    loadedFor = user;
    loading = Promise.all([
      fetchRecent('Movie', DAYS_MOVIE, 200),
      fetchRecent('Series', DAYS_SERIES, 100),
      fetchRecent('Season', DAYS_SEASON, 300),
      fetchRecent('Episode', DAYS_EPISODE, 500)
    ]).then(function (r) {
      var now = Date.now();
      /* true / false, or null when the item has no air date */
      function airedWithin(item, days) {
        if (!item.PremiereDate) return null;
        var t = Date.parse(item.PremiereDate);
        if (t > now + 864e5) return false;          /* not aired yet (1-day timezone grace) */
        return t >= now - days * 864e5;
      }
      var map = new Map();
      var seasonAiring = new Set();   /* SeasonIds with a recently aired episode */

      /* 3. New Episode (lowest priority, set first) */
      r[3].forEach(function (ep) {
        if (ep.ParentIndexNumber === 0) return;               /* specials */
        var aired = airedWithin(ep, AIR_DAYS_EPISODE);
        if (aired === false) return;                          /* old/backfilled */
        if (ep.SeasonId) seasonAiring.add(ep.SeasonId);
        if (ep.UserData && ep.UserData.Played) return;        /* already watched */
        map.set(ep.Id, LABEL_EPISODE);
        if (ep.SeriesId) map.set(ep.SeriesId, LABEL_EPISODE);
      });

      /* 2. Recently added */
      r[1].forEach(function (series) { map.set(series.Id, LABEL_ADDED); });
      r[0].forEach(function (movie) { map.set(movie.Id, LABEL_ADDED); });

      /* 1. New Season (highest; season 1 of a new show stays "Recently added") */
      r[2].forEach(function (season) {
        if (!season.SeriesId || !season.IndexNumber || season.IndexNumber < 2) return;
        var aired = airedWithin(season, AIR_DAYS_SEASON);
        if (aired === null) aired = seasonAiring.has(season.Id);
        if (aired) map.set(season.SeriesId, LABEL_SEASON);
      });
      badgeById = map;
      loadedAt = Date.now();
    }).catch(function (err) {
      console.warn('[NetFin New Badges]', err);
      loadedAt = Date.now(); /* don't hammer the server on errors */
    }).then(function () { loading = null; });
    return loading;
  }

  function decorate() {
    var cards = document.querySelectorAll('.card[data-id]');
    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      var type = card.getAttribute('data-type');
      if (type !== 'Movie' && type !== 'Series' && type !== 'Episode') continue;
      var host = card.querySelector('.cardScalable');
      if (!host) continue;
      var label = badgeById.get(card.getAttribute('data-id')) || '';
      var badge = host.querySelector(':scope > .netfin-newBadge');
      if (!label) {
        if (badge) badge.remove();
        continue;
      }
      if (badge && badge.getAttribute('data-label') === label) continue;
      if (!badge) {
        badge = document.createElement('div');
        badge.className = 'netfin-newBadge';
        host.appendChild(badge);
      }
      badge.setAttribute('data-label', label);
      badge.textContent = '';
      var main = document.createElement('span');
      main.className = 'netfin-newBadge-main';
      main.textContent = label;
      badge.appendChild(main);
      if (label === LABEL_EPISODE && LABEL_WATCH) {
        var cta = document.createElement('span');
        cta.className = 'netfin-newBadge-cta';
        cta.textContent = LABEL_WATCH;
        badge.appendChild(cta);
      }
    }
  }

  function schedule() {
    if (timer) return;
    timer = setTimeout(function () {
      timer = null;
      load().then(decorate);
    }, 250);
  }

  function isOwnBadge(node) {
    return node.nodeType === 1 && node.classList && node.classList.contains('netfin-newBadge');
  }

  function start() {
    var c = client();
    if (!c || !c.getCurrentUserId || !c.getCurrentUserId()) {
      setTimeout(start, 1000);
      return;
    }
    new MutationObserver(function (mutations) {
      for (var i = 0; i < mutations.length; i++) {
        var added = mutations[i].addedNodes;
        for (var j = 0; j < added.length; j++) {
          if (!isOwnBadge(added[j])) { schedule(); return; }
        }
      }
    }).observe(document.body, { childList: true, subtree: true });
    schedule();
  }

  start();
})();
/* END OF NetFin New Badges — if you can't see this line in JS Injector, the paste was cut off. */
