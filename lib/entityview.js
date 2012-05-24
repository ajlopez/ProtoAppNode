
// Content renderer: entity view

module.exports = exports = function(model, app, element)
{
	function getEntityByName(name)
	{
		var result = null;
		model.entities.forEach(function(entity) { if (entity.name == name) result = entity; });
		return result;
	}
	
	var entity = getEntityByName(element.entity);
	
	function getInstanceById(id)
	{
		var result = null;
		entity.data.forEach(function(instance) { if (instance.id == id) result = instance; });
		return result;
	}
	
    return function(req, res)
    {
		var instance = getInstanceById(req.params.id);
		
		res.write('<fieldset>\n');
		
		entity.properties.forEach(function(property) {
			res.write('<div>');
			res.write(property.title);
			res.write('</div>\n');
			res.write('<div>');
			
			var value = instance[property.name];
			
			if (value && typeof value !== 'string')
				value = value.toString();
			
			res.write(value);
					
			res.write('</div>\n');
		});
		
		res.write('</fieldset>\n');
    };
};

