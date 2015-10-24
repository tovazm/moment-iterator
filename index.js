var moment = require('moment');

var MomentIterator = function(startDate, endDate) {
	if (!(this instanceof MomentIterator)) {
		return new MomentIterator(startDate, endDate)
	}
	this.startDate = moment(startDate ||  new Date());
	this.endDate = moment(endDate ||  new Date());
}

MomentIterator.prototype.params = function() {
	return ([this.startDate, this.endDate])
}

MomentIterator.prototype.each = function(amplitude, callback, options) {
	var tmp = this.startDate.clone();
	var end = this.endDate.clone();
	var step;
	var counter = 0;
	if (amplitude.indexOf(' ') >= 0) {
		step = parseInt(amplitude.split(' ')[0]);
		amplitude = amplitude.split(' ')[1];
	} else {
		step = 1;
	}

	if (options && options.trailing) {
		end.add(step, amplitude)
	}

	if (options && options.leading === false) {
		tmp.add(step, amplitude);
	}

	while (tmp.isBefore(end)) {
		var rtn = tmp;
		if (options && options.toDate) {
			callback(rtn.toDate());
		} else if (options && options.format) {
			callback(rtn.format(options.format))
		} else if (options && options.toObject) {
			callback({
				m: rtn.month() + 1,
				y: rtn.year(),
				o: rtn.year() + (rtn.month() + 1) * 0.01
			})
			callback(rtn.toObject());
		} else {
			callback(rtn);
		}
		tmp.add(step, amplitude);
	}
}

MomentIterator.prototype.range = function(amplitude, options) {
	var rtn = [];
	this.each(amplitude, function(e) {
		rtn.push(e);
	}, options)
	return rtn;
}

module.exports = MomentIterator
