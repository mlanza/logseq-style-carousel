# Logseq Style Carousel Plugin

This plugin provides buttons for cycling through styles often to affect what is hidden or shown.  By default it is preconfigured with a button that:

**Toggles the visibility of completed and canceled to-dos.**

Toggling is controlled by the eye button appearing in the toolbar.  If any matching content is found on the page the eye is underlined.

*Toggling to-do visibility isn't the purpose of this plugin.*  This default exists only to demonstrate what's possible.  Buttons can be added, removed or reconfigured to conditionally find and style content in any manner you can imagine.  It is not strictly for toggling visibility.  It can be configured to do all the amazing things CSS allows on whatever blocks you choose to target!

The sample settings json below demonstrates additional options.  See the `desc` of each entry.

## Button Settings

Buttons are based on page content.

Define one or more `buttons` with the following properties:
* `hits` — An array of two strings, the first is the button style when there are hits, the second when there are no hits.
* `styles` — An array of style objects which are cycled through when the associated button is clicked
* `refreshRate` — How often in seconds to check for matching content on the current page?

Define one or more (one is unusual) styles per `button` with the following properties:
* `tooltip` — Text description of the button's the current effect.
* `char` — A character code (maps to an icon in Logseq's built-in tabler-icons) to represent the button when this style is active.
* `style` — Selector and styling rules or @import rule.
* `hits` — CSS selector for determining if hits exist on the page.

## Query Settings

Define queries to select matching blocks and dynamically mark the their DOM elements with class names.  Your custom stylesheet can use these.

* `query` — Datalog query which returns blocks.  Inputs are noted with positional placeholders such as `{0}` or `{1}`.
* `inputs` — Optional query input(s).
* `matches` — Optional regular expression(s) expressed as strings for further filtering blocks by their content text.
* `classname` — Class name to apply to matching block elements found in the DOM.

Both buttons and queries are demonstrated in this plugin settings example:

```json
{
  "disabled": false,
  "queries": [
    {
      "query": "[:find (pull ?block [*]) :where (?block :block/scheduled ?d) [(> ?d {0})]]",
      "inputs": [
        "today 0"
      ],
      "classname": "future-task",
      "matches": [],
      "disabled": false,
      "refreshRate": 30
    }
  ],
  "buttons": {
    "todos": {
      "desc": "Toggles the visibility of closed tasks",
      "disabled": false,
      "refreshRate": 5,
      "hits": [
        "text-decoration: underline;",
        ""
      ],
      "styles": [
        {
          "tooltip": "Without closed tasks",
          "char": "\\ecf0",
          "hits": "div#main-content-container div[data-refs-self*='\"done\"'], div#main-content-container div[data-refs-self*='\"canceled\"'], div#main-content-container div[data-refs-self*='\"waiting\"']",
          "style": "div[data-refs-self*='\"done\"']:not(:focus-within), div[data-refs-self*='\"canceled\"']:not(:focus-within), div[data-refs-self*='\"waiting\"']:not(:focus-within) {display: none;}"
        },
        {
          "tooltip": "With closed tasks",
          "char": "\\ea9a",
          "hits": "div#main-content-container div[data-refs-self*='\"done\"'], div#main-content-container div[data-refs-self*='\"canceled\"'], div#main-content-container div[data-refs-self*='\"waiting\"']",
          "style": "div#main-content-container:hover div[data-refs-self*='\"done\"'] span.inline, div#main-content-container:hover div[data-refs-self*='\"canceled\"'] span.inline, div#main-content-container:hover div[data-refs-self*='\"waiting\"'] span.inline {text-decoration: underline wavy;}"
        }
      ]
    },
    "futures": {
      "desc": "Toggles the visibility of future tasks",
      "disabled": false,
      "refreshRate": 5,
      "hits": [
        "text-decoration: underline;",
        ""
      ],
      "styles": [
        {
          "tooltip": "Without future tasks",
          "char": "\\eb3e",
          "hits": ".future-task",
          "style": ".future-task {display: none;}"
        },
        {
          "tooltip": "With future tasks",
          "char": "\\eb3f",
          "hits": ".future-task",
          "style": ".future-task {text-decoration: underline wavy;}"
        }
      ]
    },
    "props": {
      "desc": "Toggles the visibility of page properties",
      "disabled": false,
      "refreshRate": 5,
      "hits": [
        "text-decoration: underline;",
        ""
      ],
      "styles": [
        {
          "tooltip": "Without page properties",
          "char": "\\eeaf",
          "hits": ".pre-block",
          "style": ".pre-block {display: none}"
        },
        {
          "tooltip": "With page properties",
          "char": "\\eeb0",
          "hits": ".pre-block",
          "style": "div#main-content-container:hover .pre-block {text-decoration: underline wavy;}"
        }
      ]
    },
    "boardgames": {
      "desc": "Indicates a favorite pastime appears on the page.",
      "disabled": false,
      "refreshRate": 5,
      "hits": [
        "text-decoration: underline;",
        ""
      ],
      "styles": [
        {
          "tooltip": "Boardgames!",
          "char": "\\eb66",
          "hits": "div#main-content-container div[data-refs-self*='\"boardgame\"'], div#main-content-container div[data-refs-self*='\"boardgames\"']",
          "style": "div#main-content-container:hover div[data-refs-self*='\"boardgame\"'] span.inline, div#main-content-container:hover div[data-refs-self*='\"boardgames\"'] span.inline {background-color: lightyellow;}"
        }
      ]
    }
  }
}
```

Unless there are at least 2 styles per button there is no toggle/cycle effect.  It would not be situationally unreasonable to have 3 or more styles.

Use Character Map (a tool on Windows) to look up the codes associated with the [tabler-icons font](https://tablericons.com) ([download here](https://github.com/tabler/tabler-icons/tree/master/iconfont/fonts)) in order to select icons for your custom buttons.

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

