
// Content renderer: entity list table

module.exports = exports = function(model, app, element)
{
	function getEntityByName(name)
	{
		var result = null;
		model.entities.forEach(function(entity) { if (entity.name == name) result = entity; });
		return result;
	}
	
	var entity = getEntityByName(element.entity);
	
    return function(req, res)
    {
		res.write('<table>\n');
		
		res.write('<tr>\n');
		entity.properties.forEach(function(property) {
			res.write('<th>');
			res.write(property.title);
			res.write('</th>\n');
		});
		res.write('</tr>\n');
				
		entity.data.forEach(function(item)
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
					res.write('<a href="' + element.page.url + '/' + value + '">');
					res.write(value);
					res.write('</a>');
				}
				else
					res.write(value);
					
				res.write("</td>\n");
			});
			
			res.write("</tr>\n");
		});
					
		res.write('</table>\n');
    };
};

