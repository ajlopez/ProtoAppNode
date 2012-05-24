
// Content renderer: entity view

var protoapp = require('./protoapp');

function getItemByName(items, name)
{
	var result = null;
	
	items.forEach(function(item)
	{
		if (!result && item.name == name)
			result = item;
	});
	
	return result;
}

module.exports = exports = function(model, app, element)
{
    return function(req, res)
    {
		res.write('<div class="actions">\n');
		
		element.actions.forEach(function(action) {
			var url = action.url;
			var title = action.title;
			
			if (action.page)
			{
				var page = getItemByName(model.pages, action.page);
				
				if (page) {
					url = page.url;
					title = page.title;
				}
			}
			
			url = protoapp.expandLink(url, req.params);
		
			if (url) {
				res.write("<a href='" + url + "'>");
				res.write(title);
				res.write("</a>  ");
			}
		});
		
		res.write('</div>\n');
    };
};

