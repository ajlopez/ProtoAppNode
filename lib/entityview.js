
// Content renderer: entity view

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
	
	function getReferencedInstanceById(instances, id)
	{
		var result = null;
		instances.forEach(function(instance) { if (instance.id == id) result = instance; });
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
		
		req.instance = instance;
		
		res.write('<fieldset>\n');
		
		entity.properties.forEach(function(property) {
			res.write('<div class="display-label">');
			res.write(property.title);
			res.write('</div>\n');
			res.write('<div class="display-field">');
			
			var value = instance[property.name];
			
			if (value && typeof value !== 'string')
				value = value.toString();
				
			if (property.reference)
			{
				var refentity = getEntityByName(property.reference);
				var refinstance = getReferencedInstanceById(refentity.data, instance[property.name]);
				var refpage = getPageByName(refentity.name);
				if (refpage)
					res.write('<a href="' + protoapp.expandLink(refpage.url, refinstance) + '">');
				res.write(refinstance[refentity.properties[1].name]);
				if (refpage)
					res.write('</a>');
			}
			else
				res.write(value);
					
			res.write('</div>\n');
		});
		
		res.write('</fieldset>\n');
    };
};

