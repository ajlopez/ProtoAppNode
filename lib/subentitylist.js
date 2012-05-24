
// Content renderer: entity list table

var protoapp = require('./protoapp');

module.exports = exports = function(model, app, element)
{
	function getEntityByName(name)
	{
		var result = null;
		model.entities.forEach(function(entity) { if (entity.name == name) result = entity; });
		return result;
	}
	
	function getPageByName(name)
	{
		var result = null;
		model.pages.forEach(function(page) { if (page.name == name) result = page; });
		return result;
	}
	
	function getInstanceById(instances, id)
	{
		var result = null;
		instances.forEach(function(instance) { if (instance.id == id) result = instance; });
		return result;
	}
	
	var entity = getEntityByName(element.entity);
	
    return function(req, res)
    {
		res.write('<table>\n');
		
		var idrel = parseInt(req.params.id);
		
		res.write('<tr>\n');
		entity.properties.forEach(function(property) {
			res.write('<th>');
			res.write(property.title);
			res.write('</th>\n');
		});
		res.write('</tr>\n');
				
		entity.data.forEach(function(item)
		{
			if (item[element.key] == idrel)
			{
				res.write("<tr>\n");
				
				entity.properties.forEach(function(property)
				{
					res.write("<td>");
					var value = item[property.name];
					
					if (value && typeof value !== 'string')
						value = value.toString();
											
					if (property.name == 'id')
					{
						var entitypage = getPageByName(entity.name);
						res.write('<a href="' + protoapp.expandLink(entitypage.url, item) + '">');
						res.write(value);
						res.write('</a>');
					}
					else if (property.reference)
					{
						var refentity = getEntityByName(property.reference);
						var refinstance = getInstanceById(refentity.data, item[property.name]);
						var refpage = getPageByName(refentity.name);
						if (refpage)
							res.write('<a href="' + protoapp.expandLink(refpage.url, refinstance) + '">');
						res.write(refinstance[refentity.properties[1].name]);
						if (refpage)
							res.write('</a>');
					}
					else
						res.write(value);
						
					res.write("</td>\n");
				});
				
				res.write("</tr>\n");
			}
		});
					
		res.write('</table>\n');
    };
};

