var fs = require('fs');
function Application(model)
{
    var pageProcessFactory = defaultPageProcessFactory;
    var headerProcessFactory = defaultHeaderProcessFactory;
    var footerProcessFactory = defaultFooterProcessFactory;
    var menutext = '';
    
    if (model.header)
        model.header = normalize(model.header);

    if (model.footer)
        model.footer = normalize(model.footer);                    if (model.pages)        model.pages.forEach(function(page) {            menutext += "<li><a href='" + page.url + "'>" + page.title + "</a></li>\n";        });        
    function normalize(value)
    {
        if (Array.isArray(value))
            return value.join('\n');                            if (value.file)            return fs.readFileSync(value.file).toString();
            
        return value;
    }        function processContent(model, app, content, req, res)    {        if (Array.isArray(content))            content.forEach(function (element) { processContent(model, app, element, req, res) });        else if (typeof content == 'object')        {            if (content.__process)                content.__process(req, res);            else if (content.require)            {                content.__process = loadRequire(content.require, model.__directory)(model, app, content);                console.log("loadRequire");                content.__process(req, res);            }        }        else            res.write(content);    }        function loadRequire(filename, directory)    {        if (filename.slice(0,2) == './')            filename = directory + '/' + filename.slice(2);                return require(filename);    }        function processPage(model, app, page, req, res)    {        if (page.content)            processContent(model, app, page.content, req, res);    }
    
    function defaultPageProcessFactory(model, app, page)
    {
        return function(req, res) { processPage(model, app, page, req, res); };
    }

    function defaultHeaderProcessFactory(model, app, page)
    {
        if (!model.header)
            return null;
            
        if (model.header.indexOf('${') < 0)
            return function(req, res) { res.write(model.header); };
            
        return function(req, res) {
            var header = model.header
                .replace(/\${pagetitle}/g, page.title)
                .replace(/\${sitetitle}/g, model.title)
                .replace(/\${menu}/g, menutext);
                
            res.write(header);
        };
    }

    function defaultFooterProcessFactory(model, app, page)
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

    function registerPage(app, page)
    {
        var footerProcess = footerProcessFactory(model, this, page);
        var headerProcess = headerProcessFactory(model, this, page);
        var pageProcess = pageProcessFactory(model, this, page);

        app.get(page.url, function(req, res) {
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

exports.createApplication = function(model) { return new Application(model); }exports.loadModel = function(filename){	var model = JSON.parse(fs.readFileSync(filename).toString());	var path = fs.realpathSync(filename);		var pos = path.lastIndexOf('\\');		if (pos >= 0)		path = path.slice(0, pos);	else {		pos = path.lastIndexOf('/');		path = path.slice(0, pos);	}		model.__directory = path;		return model;}

;
