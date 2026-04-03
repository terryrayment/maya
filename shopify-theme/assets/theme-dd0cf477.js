import"./foo-3cfb730f.js";const f="modulepreload",m=function(t,o){return new URL(t,o).href},d={},v=function(o,s,l){if(!s||s.length===0)return o();const u=document.getElementsByTagName("link");return Promise.all(s.map(e=>{if(e=m(e,l),e in d)return;d[e]=!0;const n=e.endsWith(".css"),h=n?'[rel="stylesheet"]':"";if(!!l)for(let i=u.length-1;i>=0;i--){const a=u[i];if(a.href===e&&(!n||a.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${e}"]${h}`))return;const r=document.createElement("link");if(r.rel=n?"stylesheet":f,n||(r.as="script",r.crossOrigin=""),r.href=e,document.head.appendChild(r),n)return new Promise((i,a)=>{r.addEventListener("load",i),r.addEventListener("error",()=>a(new Error(`Unable to preload CSS for ${e}`)))})})).then(()=>o()).catch(e=>{const n=new Event("vite:preloadError",{cancelable:!0});if(n.payload=e,window.dispatchEvent(n),!n.defaultPrevented)throw e})},p=""+new URL("vite-4a748afd.svg",import.meta.url).href,g=""+new URL("shopify-ab6ef553.svg",import.meta.url).href;function y(t){let o=0;const s=l=>{o=l,t.innerHTML=`count is ${o}`};t.addEventListener("click",()=>s(++o)),s(0)}const c=document.createElement("div");c.className="app";c.innerHTML=`
  <a href="https://vitejs.dev" target="_blank">
    <img src="${p}" class="logo" alt="Vite logo" />
  </a>
  <a href="https://shopify.dev/themes" target="_blank">
    <img src="${g}" class="logo vanilla" alt="Shopify logo" />
  </a>
  <h1>Hello Vite!</h1>
  <div class="card">
    <button id="counter" type="button"></button>
  </div>
  <p class="read-the-docs">
    Click on the Vite logo to learn more
  </p>
`;document.body.appendChild(c);y(document.querySelector("#counter"));v(()=>import("./icon-bag-bc17d12d.js"),["./icon-bag-bc17d12d.js","./icon-bag-d022114f.css"],import.meta.url).then(({default:t})=>{document.body.appendChild(t)}).catch(t=>console.error(t));
