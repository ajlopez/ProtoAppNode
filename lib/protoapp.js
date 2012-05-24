var fs = require('fs');function getItemByName(items, name){	var result = null;		items.forEach(function(item)	{		if (!result && item.name == name)			result = item;	});		return result;}
function Application(model)
{
    var pageProcessFactory = defaultPageProcessFactory;
    var headerProcessFactory = defaultHeaderProcessFactory;
    var footerProcessFactory = defaultFooterProcessFactory;
    var menutext = '';	var app = this;
    
    if (model.header)
        model.header = normalize(model.header);

    if (model.footer)
        model.footer = normalize(model.footer);                    if (model.menu)        model.menu.forEach(function(pagename) {			var page = getItemByName(model.pages, pagename);            menutext += "<li><a href='" + page.url + "'>" + page.title + "</a></li>\n";        });        
    function normalize(value)
    {
        if (Array.isArray(value))
            return value.join('\n');                            if (value.file)            return loadFile(value.file, model.__directory);
            
        return value;
    }        function processContent(content, req, res)    {        if (Array.isArray(content))            content.forEach(function (element) { element.page = content.page; processContent(element, req, res) });        else if (typeof content == 'object')        {            if (content.__process)                content.__process(req, res);            else if (content.require)            {                content.__process = loadRequire(content.require, model.__directory)(model, app, content);                content.__process(req, res);            }        }        else            res.write(content);    }        function loadRequire(filename, directory)    {        if (filename.slice(0,2) == './')            filename = directory + '/' + filename.slice(2);		else if (filename.slice(0,2) == '..')            filename = directory + '/' + filename;		else if (filename.slice(0,2) == '~/')			filename = "./" + filename.slice(2);                return require(filename);    }        function loadFile(filename, directory)    {        if (filename.slice(0,2) == './')            filename = directory + '/' + filename.slice(2);		else if (filename.slice(0,2) == '..')            filename = directory + '/' + filename;		else if (filename.slice(0,2) == '~/')			filename = "./" + filename.slice(2);                return fs.readFileSync(filename).toString();    }        function processPage(page, req, res)    {        if (page.content)		{			page.content.page = page;            processContent(page.content, req, res);		}    }
    
    function defaultPageProcessFactory(page)
    {
        return function(req, res) { processPage(page, req, res); };
    }

    function defaultHeaderProcessFactory(page)
    {
        if (!model.header)
            return null;
            
        if (model.header.indexOf('${') < 0)
            return function(req, res) { res.write(model.header); };		        return function(req, res) {
            var header = model.header
                .replace(/\${pagetitle}/g, page.title)
                .replace(/\${sitetitle}/g, model.title)
                .replace(/\${menu}/g, menutext);
            res.write(header);
        };
    }

    function defaultFooterProcessFactory(page)
    {
        if (!model.footer)
            return null;
            
        if (model.footer.indexOf('${') < 0)
            return function(req, res) { res.write(model.footer); };
            
        return function(req, res) {
            var footer = model.footer
                .replace(/\${pagetitle}/g, page.title)
                .replace(/\${sitetitle}/g, model.title)
                
            res.write(footer);
        };
    }

    function registerPage(application, page)
    {
        var footerProcess = footerProcessFactory(page);
        var headerProcess = headerProcessFactory(page);
        var pageProcess = pageProcessFactory(page);

        application.get(page.url, function(req, res) {
            if (headerProcess)
                headerProcess(req, res);
                
            pageProcess(req, res);
            
            if (footerProcess)
                footerProcess(req, res);
                
            res.end();
        });
    }

    function registerPages(app, pages)
    {	
        var npages = pages.length;
        
        for (var k = 0; k < npages; k++)
            registerPage(app, pages[k]);
    }
    
    this.register = function(app)
    {
        if (model.pages)
            registerPages(app, model.pages);
    }
    
    this.pageProcessFactory = function(fn)
    {
        pageProcessFactory = fn;
        
        return this;
    }	}

exports.createApplication = function(model) { return new Application(model); }exports.loadModel = function(filename){	var model = JSON.parse(fs.readFileSync(filename).toString());	var path = fs.realpathSync(filename);	model.__filename = path;		var pos = path.lastIndexOf('\\');		if (pos >= 0)		path = path.slice(0, pos);	else {		pos = path.lastIndexOf('/');		path = path.slice(0, pos);	}		model.__directory = path;		return model;}function expandLink(link, params){	if (!params || !link)		return link;			for (var n in params)	{		var name = ":" + n;		var value = params[n];				for (var pos = link.indexOf(name); pos >= 0; pos = link.indexOf(name))		{			link = link.slice(0, pos) + value + link.slice(pos+name.length);		}	}		return link;}exports.expandLink = expandLink;
;
