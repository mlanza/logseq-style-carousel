const config = {
  buttons: {
    futures: {
      refreshRate: 5,
      hits: ["text-decoration: underline;", ""],
      styles: [{
        char: "\\eb3e",
        query: `[:find (pull ?block [*])
          :in $ ?start ?end
          :where
          (or
            [?block :block/scheduled ?d]
            [?block :block/deadline ?d])
          [(> ?d ?start)]
          [(< ?d ?end)]]`,
        inputs: ["today 1", "today 30"],
        selector: "div[blockid=\"$uuid\"]",
        matches: /./,
        style: `{display: none;}`
      },{
        char: "\\eb3f",
        query: `[:find (pull ?block [*])
          :in $ ?start ?end
          :where
          (or
            [?block :block/scheduled ?d]
            [?block :block/deadline ?d])
          [(> ?d ?start)]
          [(< ?d ?end)]]`,
        inputs: ["today 1", "today 30"],
        selector: "div#main-content-container:hover div[blockid=\"$uuid\"]",
        matches: /./,
        style: `{text-decoration: underline wavy;}`
      }]
    },
    todos: {
      refreshRate: 5,
      hits: ["text-decoration: underline;", ""],
      styles: [{
        char: "\\ecf0",
        style: `div[data-refs-self*='"done"']:not(:focus-within), div[data-refs-self*='"canceled"']:not(:focus-within) {display: none;}`,
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

function today(os){
  const offset = os ? parseInt(os) : 0;
  const dt = new Date();
  const date = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate() + offset, 0, 0, 0);
  return parseInt(date.getFullYear().toString() + (date.getMonth() + 1).toString().padStart(2, "0") + date.getDate().toString().padStart(2, "0"));
}

const fns = {
  today: today
}

async function cycle(el) {
  const key = el.dataset.key,
        st  = state[key],
        cfg = config.buttons[key];
  st.idx = cfg.styles[st.idx + 1] ? st.idx + 1 : 0;
  await refresh(key, cfg, st);
}

function expandInput(input){
  const [named, ...args] = input.split(" ");
  const fn = fns[named];
  return fn ? fn.apply(null, args) : input;
}

async function findIds({query, inputs, selector, matches, style}){
  const results = (await logseq.DB.datascriptQuery.apply(logseq.DB, [query].concat(inputs.map(expandInput))) || []).flat();
  const hits = results.filter(function(block){
    return !!matches && matches.test(block.content);
  }).map(function(block){
    return block.uuid.$uuid$;
  }).map(function(uuid){
    return selector.replace(/\$uuid/g, uuid);
  }).join(", ");
  return {hits, style: hits + " " + style};
}

async function refresh(key, config, state){
  const current = config.styles[state.idx];
  const {query} = current;
  const {char, style, hits, inputs, selector, matches} = Object.assign(current, query ? await findIds(current) : null);

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

async function main(){
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
    await refresh(key, btn, st);
    refreshHits(key, btn, st);
  }
}

logseq.ready(createModel(), main).catch(console.error.bind(console));
