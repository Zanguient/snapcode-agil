$(document).ready(function(){var e=eval;$("h2").each(function(){var t=function(e){var t={},n=[{name:"html",text:"Your HTML"},{name:"js",text:"Your Javascript"},{name:"css",text:"Your CSS"}];for(i=0;i<n.length;i++){var r=e.filter(function(){return $(this).text()==n[i].text}).next();r.length&&("p"==r.get(0).nodeName.toLowerCase()&&(r=r.next()),t[n[i].name]={element:r,code:r.children().text()})}return t}($(this).nextUntil("h2").filter("h3")),n=$("head");if(t.js&&t.html){t.css&&n.append('<style type="text/css">'+t.css.code+"</style>");var r=$("<h3/>",{text:"Demo"}).insertAfter(t.js.element);$("<div/>",{class:"demo",html:t.html.code}).insertAfter(r),e(t.js.code)}}),$("<div/>",{id:"jobsearch",html:'Do you need Frontend/Javascript/jQuery help with your project? I\'m looking for new freelance gigs! Please send me a email to <a href="mailto:contact@mustardamus.com">contact@mustardamus.com</a>.'}).prependTo("#wrapper")});