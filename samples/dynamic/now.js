
// Content renderer: now date time

module.exports = exports = function(model, app, element)
{
    return function(req, res)
    {
        res.write((new Date()).toString());
    };
};

