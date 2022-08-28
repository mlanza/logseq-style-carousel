# Logseq Style Carousel Plugin

This plugin provides buttons for cycling through styles often to affect what is hidden or shown.  By default it is preconfigured with a button that:

**Toggles the visibility of completed and canceled to-dos.**

Toggling is controlled by the eye button appearing in the toolbar.  If any matching content is found on the page the eye is underlined.

*Toggling to-do visibility isn't the purpose of this plugin.*  This default exists only to demonstrate what's possible.  Buttons can be added, removed or reconfigured to conditionally find and style content in any manner you can imagine.  It is not strictly for toggling visibility.  It can be configured to do all the amazing things CSS allows on whatever blocks you choose to target!

The sample settings json below demonstrates additional options.  See the `desc` of each entry.

## Settings

Buttons are based on page content.

Define one or more `buttons` with the following properties:
* `hits` — An array of two strings, the first is the button style when there are hits, the second when there are no hits.
* `styles` — An array of style objects which are cycled through when the associated button is clicked
* `refreshRate` — How often in seconds to check for matching content on the current page?

Define one or more (one is unusual, two typical) styles per `button` with the following properties:
* `tooltip` — Text description of the button's the current effect.
* `char` — A character code (maps to an icon in Logseq's built-in tabler-icons) to represent the button when this style is active.
* `status` — A machine-friendly name for the current status.  As one cycles through statuses this status will be etched into the `body` element.
* `style` — Selector and styling rules or @import rule.
* `hits` — CSS selector for determining if hits exist on the page.

The following settings are an example of how to define buttons:

```json
{
  "disabled": false,
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
          "status": "without-closed",
          "hits": "div#main-content-container div[data-refs-self*='\"done\"'], div#main-content-container div[data-refs-self*='\"canceled\"'], div#main-content-container div[data-refs-self*='\"waiting\"']",
          "style": "div[data-refs-self*='\"done\"']:not(:focus-within), div[data-refs-self*='\"canceled\"']:not(:focus-within), div[data-refs-self*='\"waiting\"']:not(:focus-within) {display: none;}"
        },
        {
          "tooltip": "With closed tasks",
          "char": "\\ea9a",
          "status": "with-closed",
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
          "status": "without-future",
          "hits": ".future",
          "style": ".future {display: none;}"
        },
        {
          "tooltip": "With future tasks",
          "char": "\\eb3f",
          "status": "with-future",
          "hits": ".future",
          "style": ".future {text-decoration: underline wavy;}"
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
          "status": "without-props",
          "hits": ".pre-block",
          "style": ".pre-block {display: none}"
        },
        {
          "tooltip": "With page properties",
          "char": "\\eeb0",
          "status": "with-props",
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
          "status": "boardgames",
          "hits": "div#main-content-container div[data-refs-self*='\"boardgame\"'], div#main-content-container div[data-refs-self*='\"boardgames\"']",
          "style": "div#main-content-container:hover div[data-refs-self*='\"boardgame\"'] span.inline, div#main-content-container:hover div[data-refs-self*='\"boardgames\"'] span.inline {background-color: lightyellow;}"
        }
      ]
    }
  }
}
```

Unless there are at least 2 styles per button there is no toggle/cycle effect.  It would not be situationally unreasonable to have 3 or more styles.  Change the default style for any button by reordering the `styles` array.

Use Character Map (a tool on Windows) to look up the codes associated with the [tabler-icons font](https://tablericons.com) ([download here](https://github.com/tabler/tabler-icons/tree/master/iconfont/fonts)) in order to select icons for your custom buttons.

The `futures` button relies on classes made possible by [Classy](https://github.com/mlanza/logseq-classy).

### Statuses

Each button has a set of statuses.  Take the `todos` button.  Style Carousel will automatically add a `[data-sc-todos]` attribute to the body element.  The attribute will reflect the current button status and cycle through them as the button is clicked:

* \[data-sc-todos="without-closed"\]
* \[data-sc-todos="with-closed"\]

This feature was added later to permit all styling to be defined in the `custom.css`.  While the `style` and `status` settings are compatible, they're designed to be mutually exclusive.  When `status` is used the CSS rules can be transferred to the custom stylesheet and the `style` setting can be dropped.

So, for example, the `style` attributes can be removed from settings and these CSS rules added to your custom stylesheet:

```css
body[data-sc-todos="without-closed"] div[data-refs-self*="done"]:not(:focus-within),
body[data-sc-todos="without-closed"] div[data-refs-self*="canceled"]:not(:focus-within),
body[data-sc-todos="without-closed"] div[data-refs-self*="waiting"]:not(:focus-within) {
  display: none;
}
body[data-sc-todos="with-closed"] div#main-content-container:hover div[data-refs-self*="done"] span.inline,
body[data-sc-todos="with-closed"] div#main-content-container:hover div[data-refs-self*="canceled"] span.inline,
body[data-sc-todos="with-closed"] div#main-content-container:hover div[data-refs-self*="waiting"] span.inline {
  text-decoration: underline wavy;
}
```

The use of the `style` setting remains supported but is now deprecated.

## Using the eye icon from Wide Eyed

Style Carousel, the successor to the Wide Eyed Plugin, uses Logseq's native font icons.  If you prefer the icons originally used by the Wide Eyed Plugin, update your `custom.css`.

Add the following import directive to the top:
```css
@import url("https://at.alicdn.com/t/font_2409735_haugsknp36e.css");
```

In the body add:
```css
.carousel[data-key="todos"] i:before {
  font-family: iconfont !important;
}
```

Finally, in the plugin settings update the `char`s used in the `styles` for the `todos` button:

```js
  ...
  "buttons": {
    "todos": {
      ...
      "styles": [
        {
          "tooltip": "Without closed tasks",
          "char": "\\e600", //<- here
          ...
        },
        {
          "tooltip": "With closed tasks",
          "char": "\\e6ed", //<- here
          ...
        }
      ]
    }
```

## License
[MIT](./LICENSE.md)
