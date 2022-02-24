# Logseq Style Carousel Plugin

This plugin is designed to provide one or more buttons which cycle through predefined styles.  By default it is preconfigured with a button providing the following behavior:

**Toggles the visibility of completed and canceled to-dos.**

Toggling is controlled by the eye button appearing in the toolbar.  If any matching content is found on the page the eye is underlined.

Buttons can be added, removed or reconfigured as desired.  *Toggling to-do visibility wasn't meant to be the sole purpose of this plugin.*  Rather this feature provides an example of what's possible.  The purpose is to allow you to configure buttons which conditionally find and style content in whatever manner you dream up.

## IMPORTANT

The _current implementation fails_ when installed from the marketplace due to cross-origin iframe issues caused by the call to `top.document` in [index.js](index.js).  Until I solve this you will be better served to install it as described under Manual Installation.

If you have any ideas, feel free to reach out.

## Configurable Settings

Define one or more `buttons` with the following properties:
* `hits` — an array of two strings, the first is the button style when there are hits, the second when there are no hits.
* `styles` — an array of style objects which are cycled through when the associated button is clicked
* `refreshRate` — how often in seconds to check for matching content on the current page?

Define two or more styles per `button` with the following properties:
* `char` — a character code (maps to an icon in Logseq's built-in tabler-icons) to represent the button when this style is active
* `style` — selector and styling rules or @import rule
* `hits` — css selector for determining if hits exist on the page

```json
{
  "buttons": {
    "todos": {
      "refreshRate": 5,
      "hits": ["text-decoration: underline;", ""],
      "styles": [{
        "char": "\\ecf0",
        "style": "div[data-refs-self*='\"done\"'], div[data-refs-self*='\"canceled\"'] {display: none;}",
        "hits": "div#main-content-container div[data-refs-self*='\"done\"'], div#main-content-container div[data-refs-self*='\"canceled\"']"
      },{
        "char": "\\ea9a",
        "style": "div#main-content-container:hover div[data-refs-self*='\"done\"'] span.inline, div#main-content-container:hover div[data-refs-self*='\"canceled\"'] span.inline {text-decoration: underline wavy;}",
        "hits": "div#main-content-container div[data-refs-self*='\"done\"'], div#main-content-container div[data-refs-self*='\"canceled\"']"
      }]
    }
  }
}
```

Unless there are at least 2 styles per button there is no toggle/cycle effect.

Use Character Map (a tool on Windows) to look up the codes associated with the tabler-icons font in order to select icons for your custom buttons.

## Manual installation
* Download this repo
* In Logseq:
  * Ensure Developer Mode is on
  * Open Plugins
  * Select `Load unpacked plugin`

## License
[MIT](./LICENSE.md)

