'use strict';
'require baseclass';
'require fs';

var base = '/sys/class/power_supply';

/* POWER_SUPPLY_CAPACITY=7 -> { CAPACITY: '7' } */
function parseUevent(text) {
	var props = {};

	(text || '').split(/\n/).forEach(function(line) {
		var m = line.match(/^POWER_SUPPLY_([A-Z0-9_]+)=(.*)$/);
		if (m)
			props[m[1]] = m[2];
	});

	return props;
}

function progressbar(pc, label) {
	return E('div', {
		'class': 'cbi-progressbar',
		'title': label
	}, E('div', { 'style': 'width:%d%%'.format(pc) }));
}

function row(title, value) {
	return E('tr', { 'class': 'tr' }, [
		E('td', { 'class': 'td left', 'width': '33%' }, [ title ]),
		E('td', { 'class': 'td left' }, [ value ])
	]);
}

return baseclass.extend({
	title: _('Battery'),

	load: function() {
		return L.resolveDefault(fs.list(base), []).then(function(entries) {
			return Promise.all(entries.map(function(e) {
				return L.resolveDefault(fs.read(base + '/' + e.name + '/uevent'), null);
			}));
		}).then(function(uevents) {
			return uevents.filter(function(u) { return u != null; }).map(parseUevent);
		});
	},

	render: function(supplies) {
		var batteries = (supplies || []).filter(function(p) { return p.TYPE == 'Battery'; }),
		    chargers = (supplies || []).filter(function(p) { return p.TYPE != 'Battery' && p.ONLINE != null; });

		if (!batteries.length)
			return null;

		var table = E('table', { 'class': 'table' });

		batteries.forEach(function(p) {
			var pc = Math.max(0, Math.min(100, parseInt(p.CAPACITY) || 0)),
			    status = p.STATUS ? _(p.STATUS) : null;

			if (p.CAPACITY != null)
				table.appendChild(row(_('Level'),
					progressbar(pc, status ? '%d%% (%s)'.format(pc, status) : '%d%%'.format(pc))));

			if (status)
				table.appendChild(row(_('Status'), status));

			if (p.VOLTAGE_NOW != null)
				table.appendChild(row(_('Voltage'), '%.2f V'.format(parseInt(p.VOLTAGE_NOW) / 1000000)));

			/* microamperes, positive while charging */
			if (p.CURRENT_NOW != null)
				table.appendChild(row(_('Current'), '%d mA'.format(Math.round(parseInt(p.CURRENT_NOW) / 1000))));

			/* tenths of a degree Celsius */
			if (p.TEMP != null)
				table.appendChild(row(_('Temperature'), '%.1f °C'.format(parseInt(p.TEMP) / 10)));

			if (p.HEALTH)
				table.appendChild(row(_('Health'), _(p.HEALTH)));
		});

		chargers.forEach(function(p) {
			table.appendChild(row(_('Charger') + (p.TYPE ? ' (%s)'.format(p.TYPE) : ''),
				(p.ONLINE == '1') ? _('Connected') : _('Not connected')));
		});

		return table;
	}
});
