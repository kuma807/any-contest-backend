(this["webpackJsonppart2-notes"]=this["webpackJsonppart2-notes"]||[]).push([[0],{81:function(e,t,n){"use strict";n.r(t);var c=n(1),s=n(0),r=n(24),a=n.n(r),i=n(37),j=n(88),l=n(7),o=function(){return Object(c.jsxs)("div",{children:[Object(c.jsx)("h2",{children:"frontend"}),Object(c.jsx)("p",{children:"nanimo wakaranai man"})]})},u=n(83),b=n(9),d=function(e){var t=e.fields;return Object(c.jsx)(u.a,{striped:!0,children:Object(c.jsx)("tbody",{children:t.map((function(e){return Object(c.jsx)("tr",{children:Object(c.jsx)("td",{children:Object(c.jsx)(b.b,{to:"/fields/".concat(e.name),children:e.name})})},e.id)}))})})},h=function(e){var t=e.field;return Object(c.jsx)("div",{children:Object(c.jsx)("h2",{children:t.name})})},O=n(87),x=n(86),p=function(e){var t=e.user,n=e.style;return t.name?Object(c.jsx)("em",{style:n,children:t.name}):Object(c.jsxs)(x.a.Link,{href:"#",as:"span",children:[Object(c.jsx)(b.b,{to:"/signup",style:n,children:"signup"}),Object(c.jsx)(b.b,{to:"/login",style:n,children:"login"})]})},f={padding:5,color:"white"},m=function(e){var t=e.user;return Object(c.jsxs)(O.a,{collapseOnSelect:!0,expand:"lg",bg:"dark",variant:"dark",text:"light",children:[Object(c.jsx)(x.a,{className:"mr-auto",children:Object(c.jsxs)(x.a.Link,{href:"#",as:"span",children:[Object(c.jsx)(b.b,{style:f,to:"/",children:"home"}),Object(c.jsx)(b.b,{style:f,to:"/fields",children:"contests"}),Object(c.jsx)(b.b,{style:f,to:"/users",children:"users"})]})}),Object(c.jsx)(x.a,{children:Object(c.jsx)(p,{user:t,style:f})})]})},g=n(25),v=n.n(g),w=n(29),y=n(85),k=n(84),L=n(50),S=n.n(L),T=function(){var e=Object(w.a)(v.a.mark((function e(t){var n;return v.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,S.a.post("/api/login/",t);case 2:return n=e.sent,e.abrupt("return",n.data);case 4:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),U=function(e){var t=e.setUser,n=e.setMessage,s=Object(l.g)(),r=function(){var e=Object(w.a)(v.a.mark((function e(c){var r,a,i;return v.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return c.preventDefault(),r=c.target[0].value,a=c.target[1].value,e.prev=3,console.log("".concat(r," ").concat(a)),e.next=7,T({id:r,password:a});case 7:i=e.sent,n("welcome ".concat(r)),setTimeout((function(){n(null)}),1e4),window.localStorage.setItem("loggedUser",JSON.stringify(i)),console.log(i),t({id:r,name:i.name}),n("welcome ".concat(i.name)),setTimeout((function(){n(null)}),1e4),e.next=21;break;case 17:e.prev=17,e.t0=e.catch(3),n("wrong credentials"),setTimeout((function(){n(null)}),5e3);case 21:s.push("/");case 22:case"end":return e.stop()}}),e,null,[[3,17]])})));return function(t){return e.apply(this,arguments)}}();return Object(c.jsxs)("div",{children:[Object(c.jsx)("h2",{children:"login"}),Object(c.jsx)(y.a,{onSubmit:r,children:Object(c.jsxs)(y.a.Group,{children:[Object(c.jsx)(y.a.Label,{children:"id:"}),Object(c.jsx)(y.a.Control,{type:"text",name:"id"}),Object(c.jsx)(y.a.Label,{children:"password:"}),Object(c.jsx)(y.a.Control,{type:"password"}),Object(c.jsx)(k.a,{variant:"primary",type:"submit",children:"login"})]})})]})},C=function(e){var t=e.setUser,n=e.setMessage,s=Object(l.g)();return Object(c.jsxs)("div",{children:[Object(c.jsx)("h2",{children:"signup"}),Object(c.jsx)(y.a,{onSubmit:function(e){e.preventDefault();var c=e.target[0].value;e.target[1].value;t({id:c,name:"tempName"}),n("welcome ".concat(c)),setTimeout((function(){n(null)}),1e4),s.push("/")},children:Object(c.jsxs)(y.a.Group,{children:[Object(c.jsx)(y.a.Label,{children:"id:"}),Object(c.jsx)(y.a.Control,{type:"text",name:"id"}),Object(c.jsx)(y.a.Label,{children:"password:"}),Object(c.jsx)(y.a.Control,{type:"password"}),Object(c.jsx)(y.a.Label,{children:"confirme password:"}),Object(c.jsx)(y.a.Control,{type:"password"}),Object(c.jsx)(k.a,{variant:"primary",type:"submit",children:"login"})]})})]})},J=function(){return Object(c.jsxs)("div",{children:[Object(c.jsx)("h2",{children:"TKTL notes app"}),Object(c.jsxs)("ul",{children:[Object(c.jsx)("li",{children:"Matti Luukkainen"}),Object(c.jsx)("li",{children:"Juha Tauriainen"}),Object(c.jsx)("li",{children:"Arto Hellas"})]})]})},M=function(){var e=[{name:"math"},{name:"programe"},{name:"quize"}],t=Object(s.useState)({}),n=Object(i.a)(t,2),r=n[0],a=n[1],u=Object(s.useState)(null),b=Object(i.a)(u,2),O=b[0],x=b[1],p=Object(l.h)("/fields/:name"),f=p?e.find((function(e){return e.name===p.params.name})):null;return Object(s.useEffect)((function(){var e=window.localStorage.getItem("loggedUser");if(e){var t=JSON.parse(e);a(t)}}),[]),Object(c.jsxs)("div",{children:[O&&Object(c.jsx)(j.a,{variant:"success",children:O}),Object(c.jsx)(m,{user:r}),Object(c.jsxs)(l.d,{children:[Object(c.jsx)(l.b,{path:"/fields/:name",children:Object(c.jsx)(h,{field:f})}),Object(c.jsx)(l.b,{path:"/fields",children:Object(c.jsx)(d,{fields:e})}),Object(c.jsx)(l.b,{path:"/users",children:r?Object(c.jsx)(J,{}):Object(c.jsx)(l.a,{to:"/login"})}),Object(c.jsx)(l.b,{path:"/login",children:Object(c.jsx)(U,{setUser:function(e){return a(e)},setMessage:function(e){return x(e)}})}),Object(c.jsx)(l.b,{path:"/signup",children:Object(c.jsx)(C,{setUser:function(e){return a(e)},setMessage:function(e){return x(e)}})}),Object(c.jsx)(l.b,{path:"/",children:Object(c.jsx)(o,{})})]}),Object(c.jsxs)("div",{children:[Object(c.jsx)("br",{}),Object(c.jsx)("em",{children:"kuso app"})]})]})};a.a.render(Object(c.jsx)(b.a,{children:Object(c.jsx)(M,{})}),document.getElementById("root"))}},[[81,1,2]]]);
//# sourceMappingURL=main.03c81584.chunk.js.map