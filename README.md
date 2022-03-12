# Logseq Style Carousel Plugin

This plugin provide buttons for cycling through styles often to affect what is hidden or shown.  By default it is preconfigured with a button that:

**Toggles the visibility of completed and canceled to-dos.**

Toggling is controlled by the eye button appearing in the toolbar.  If any matching content is found on the page the eye is underlined.

*Toggling to-do visibility isn't the purpose of this plugin.*  This default exists only to demonstrate what's possible.  Buttons can be added, removed or reconfigured to conditionally find and style content in any manner you can imagine.  It is not strictly for toggling visibility.  It can be configured to do all the amazing things CSS allows on whatever blocks you choose to target!

The below sample settings demonstrates two additional options:
* Toggling the visibility of future tasks
* Toggling the visibility of page properties

**The `hits` feature will not work when installed from the marketplace due to [cross-origin iframe issues](https://discuss.logseq.com/t/need-help-resolving-a-plugin-issue-regarding-cross-frame-origin/5750) caused by the call to `top.document` in [index.js](index.js).  You can either accept this deficit or to regain the feature, [install the plugin locally](#manual-installation).**

## Basic Button Settings

Basic buttons are based purely on page content.  They are unaided by queries.

Define one or more `buttons` with the following properties:
* `hits` — An array of two strings, the first is the button style when there are hits, the second when there are no hits.
* `styles` — An array of style objects which are cycled through when the associated button is clicked
* `refreshRate` — How often in seconds to check for matching content on the current page?

Define two or more styles per `button` with the following properties:
* `tooltip` — Text description of the button's the current effect.
* `char` — A character code (maps to an icon in Logseq's built-in tabler-icons) to represent the button when this style is active.
* `style` — Selector and styling rules or @import rule.
* `hits` — CSS selector for determining if hits exist on the page.

## Advanced Button Settings

Advanced buttons are aided by queries and several additional attributes.  Queries are used to find and filter matching blocks.  The uuids of these blocks are used for generating selectors and applying style rules.

Define two or more styles per `button` with the following properties:
* `query` — Datalog query which returns blocks.
* `inputs` — Optional query input(s).
* `matches` — Optional regular expression(s) expressed as strings for filtering blocks by their content text.
* `hit` — Hit template with a "@uuid" (to be replaced) used, in aggregate, to generate a selector targeting matching blocks.  Used to detect hits on the current page.
* `selector` — Optional template with a "@uuid" (to be replaced) for generating a selector targeting matching blocks.  Use only if you want to style elements which vary, perhaps slightly, from those considered hits.
* `rules` — The CSS rules to apply against target elements.  The `style` for basic buttons is directly provided.  The `style` for advanced buttons is derived from the aggregate `selector` and the `rules`.

Both basic and advanced buttons are demonstrated in this plugin settings example:

```json
{
  "buttons": {
    "todos": {
      "refreshRate": 5,
      "hits": ["text-decoration: underline;", ""],
      "styles": [{
        "tooltip": "Without closed tasks",
        "char": "\\ecf0",
        "hits": "div#main-content-container div[data-refs-self*='\"done\"'], div#main-content-container div[data-refs-self*='\"canceled\"']",
        "style": "div[data-refs-self*='\"done\"']:not(:focus-within), div[data-refs-self*='\"canceled\"']:not(:focus-within) {display: none;}"
      },{
        "tooltip": "With closed tasks",
        "char": "\\ea9a",
        "hits": "div#main-content-container div[data-refs-self*='\"done\"'], div#main-content-container div[data-refs-self*='\"canceled\"']",
        "style": "div#main-content-container:hover div[data-refs-self*='\"done\"'] span.inline, div#main-content-container:hover div[data-refs-self*='\"canceled\"'] span.inline {text-decoration: underline wavy;}"
      }]
    },
    "futures": {
      "refreshRate": 5,
      "hits": ["text-decoration: underline;", ""],
      "styles": [{
        "tooltip": "Without future tasks",
        "char": "\\eb3e",
        "query": "[:find (pull ?block [*]) :in $ ?start ?end :where (or [?block :block/scheduled ?d] [?block :block/deadline ?d]) [(> ?d ?start)] [(< ?d ?end)]]",
        "inputs": ["today 1", "today 10000"],
        "matches": [],
        "hit": "div[blockid=\"@uuid\"]",
        "rules": "{display: none;}"
      }, {
        "tooltip": "With future tasks",
        "char": "\\eb3f",
        "query": "[:find (pull ?block [*]) :in $ ?start ?end :where (or [?block :block/scheduled ?d] [?block :block/deadline ?d]) [(> ?d ?start)] [(< ?d ?end)]]",
        "inputs": ["today 1", "today 10000"],
        "matches": [],
        "hit": "div[blockid=\"@uuid\"]",
        "selector": "div#main-content-container:hover div[blockid=\"@uuid\"]",
        "rules": "{text-decoration: underline wavy;}"
      }]
    },
    "props": {
      "refreshRate": 5,
      "hits": ["text-decoration: underline;", ""],
      "styles": [{
        "tooltip": "Without page properties",
        "char": "\\eeaf",
        "hits": ".pre-block",
        "style": ".pre-block {display: none}"
      },{
        "tooltip": "With page properties",
        "char": "\\eeb0",
        "hits": ".pre-block",
        "style": "div#main-content-container:hover .pre-block {text-decoration: underline wavy;}"
      }]
    }
  }
}
```

Unless there are at least 2 styles per button there is no toggle/cycle effect.  It would not be situationally unreasonable to have 3 or more styles.

Use Character Map (a tool on Windows) to look up the codes associated with the [tabler-icons font](https://tablericons.com) in order to select icons for your custom buttons.

## Queries

Queries are refreshed periodically even as one navigates between pages.  The queries are global and do not target the current page.  The resulting style rules, even if larger in scope than the current page, are adequate for application against the current page.  A query that targets too many blocks may add substantial overhead to advanced buttons.  Mind your refresh rates the larger the potential result set.

### Calculations

Logseq can itself calculate relative values but [it does not expose them in a manner plugins can utilize](https://discuss.logseq.com/t/support-relative-values-e-g-resolve-input-in-plugin-queries/6010).  This plugin, therefore, currently only implements one calculation: `today`.  It accepts a single argument, an offset from today.  Thus, 0 is today, -1 yesterday, 1 tomorrow, etc.  More calculations can be added as needs arise.

Calculations (like Logseq's `resolve-input`) target both query `inputs` and regex `matches`.  However, there are currently no calculations suitable for generating regular expressions (that is, `matches` use).  Those too can be added as needs arise.

## Manual installation
* Download this repo
* In Logseq:
  * Ensure Developer Mode is on
  * Open Plugins
  * Select `Load unpacked plugin`

## License
[MIT](./LICENSE.md)

