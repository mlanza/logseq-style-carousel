const config = {
  buttons: {
    todos: {
      refreshRate: 5,
      hits: ["text-decoration: underline;", ""],
      styles: [{
        char: "\\ecf0",
        style: `div[data-refs-self*='"done"'], div[data-refs-self*='"canceled"'] {display: none;}`,
        hits: `div#main-content-container div[data-refs-self*='"done"'], div#main-content-container div[data-refs-self*='"canceled"']`
      },{
        char: "\\ea9a",
        style: `div#main-content-container:hover div[data-refs-self*='"done"'] span.inline, div#main-content-container:hover div[data-refs-self*='"canceled"'] span.inline {text-decoration: underline wavy;}`,
        hits: `div#main-content-container div[data-refs-self*='"done"'], div#main-content-container div[data-refs-self*='"canceled"']`
      }]
    }
  }
};

const state = {};

function cycle(el) {
  const key = el.dataset.key,
        st  = state[key],
        cfg = config.buttons[key];
  st.idx = cfg.styles[st.idx + 1] ? st.idx + 1 : 0;
  refresh(key, cfg, st);
}

function refresh(key, config, state){
  const {char, style, hits} = config.styles[state.idx];
  state.hits = hits;
  logseq.App.registerUIItem('toolbar', {
    key: `button-${key}`,
    template: `
    <a class="button carousel" data-key="${key}" data-on-click="cycle">
      <i></i>
    </a>
    `,
  });
  logseq.provideStyle({
    key: `active-${key}`,
    style
  });
  logseq.provideStyle({
    key: `icon-${key}`,
    style: `
    .carousel[data-key="${key}"] i:before {
      content: "${char}";
    }`
  });
}

function refreshHits(key, config, state){
  (config.refreshRate || 0) > 0 && setInterval(function(){
    if (state.hits) {
      const el = top.document.querySelector(state.hits);
      const style = el ? config.hits[0] : config.hits[1];
      logseq.provideStyle({
        key: `hits-${key}`,
        style: `
        .carousel[data-key="${key}"] i:before {
          ${style};
        }`
      });
    }
  }, config.refreshRate * 1000);
}

function createModel(){
  return {refresh, cycle};
}

function main(){
  Object.assign(config, logseq.settings);

  logseq.provideStyle({
    key: 'main',
    style: `.carousel {
      display: block;
      font-size: 20px;
      margin-top: 0;
    }
    .carousel i:before {
      font-family: tabler-icons;
      font-style: normal;
      color: var(--ls-primary-text-color);
    }`
  });

  for (let key in config.buttons) {
    const btn = config.buttons[key],
          st  = state[key] = {idx: 0};
    refresh(key, btn, st);
    refreshHits(key, btn, st);
  }
}

logseq.ready(createModel(), main).catch(console.error.bind(console));
