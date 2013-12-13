requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'js',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
        app: '/'
    }
});

// Start the main app logic.
requirejs(['knockout', 'jquery', 'jquery.flot', 'jquery.flot.time'],
function (ko, $) {
	function viewModel() {
	    var self = this;
	    
	    this.currentBtcValue = ko.observable(0);
	    this.lastBtcValue = ko.observable(0);
	    this.currentBtcFloat = ko.observable(0.0);
	    this.lastBtcFloat = ko.observable(0.0);
	    this.btcValueArray = ko.observableArray();
	    this.btcValueGraphArray = ko.observableArray([]);
	    this.btcPolling = ko.observable(false);
	    this.updateInterval = ko.observable(5);
	    this.interval = ko.observable(undefined);
	    this.purchasedBtcCost = ko.observable(104);
	    this.purchasedBtcAmount = ko.observable(.119);
	    this.currentPurchasedBtcValue = ko.observable(0);
	    this.purchasedBtcToSell = ko.observable(0);
	    this.currentProfit = ko.observable(0);
	    this.purchaseRate = ko.observable(0);
	    this.showDelta = ko.observable(false);
	    this.sellBtcAmount = ko.observable(0);
	    this.sellProfit = ko.observable(0);
	    this.sellPrice = ko.observable(0);
	    
	    
	    Number.prototype.padLeft = function(base,chr){
	    	   var  len = (String(base || 10).length - String(this).length)+1;
	    	   return len > 0? new Array(len).join(chr || '0')+this : this;
	    }
	    
	    var graphOptions = {
		        xaxis: {
			          mode: "time",
			          timeformat: "%m/%d/%y - %h:%M:%S",
			          min: (new Date()).getTime(),
			          max: (new Date()).getTime()
			        },
			        series: {
			          lines: { show: true },
			          points: { show: true }
			        },
			        grid: { 
			          hoverable: true, 
			          clickable: true 
			        }
			      };
	    
	    $.plot($("#placeholder"), [this.btcValueGraphArray()], graphOptions);
	    
	    this.getValues = function() {
	    	var currentPurchasedBtcValue = self.purchasedBtcAmount() * self.currentBtcFloat();
	    	var purchaseRate = self.purchasedBtcCost() / self.purchasedBtcAmount();
	    	self.currentPurchasedBtcValue(currentPurchasedBtcValue.toFixed(2));
	    	self.purchaseRate(purchaseRate.toFixed(2));
	    	
	    	var profit = self.currentPurchasedBtcValue() - self.purchasedBtcCost();
	    	self.currentProfit(profit.toFixed(2));
	    	
	    	var sellPrice = self.sellBtcAmount() * self.currentBtcFloat();
	    	self.sellPrice(sellPrice);
	    	
	    	var sellProfit = (self.sellBtcAmount() * self.currentBtcFloat()) - (self.sellBtcAmount() * purchaseRate);
	    	self.sellProfit(sellProfit);
	    };
	    
	    this.purchasedBtcCost.subscribe(function() {
	    	self.getValues();
	    });
	    
	    this.purchasedBtcAmount.subscribe(function() {
	    	self.getValues();
	    });
	    
	    this.sellBtcAmount.subscribe(function() {
	    	self.getValues();
	    });
	    
	    self.btcValueGraphArray.subscribe(function(graphArray) {
	    	self.getValues();
	    	graphOptions.xaxis.max = (new Date()).getTime();
	    	$.plot($("#placeholder"), [graphArray], graphOptions);

	    });
	    
	    
		
	    this.getBtcValue = function() {
	    	self.btcPolling(true);
	    	$.ajax({
		    	  url: "btc-services.php",
		    	  context: self,
		    	  dataType: 'json'
		    }).done(function(data) {
			var btcValue = '$' + data.ticker.last;
		    	var btcFloat = data.ticker.last;
		    	self.currentBtcValue(btcValue);
		    	self.currentBtcFloat(btcFloat);
		    	
	    		var color = 'black';
	    		if (self.lastBtcValue() < self.currentBtcValue()) {
	    			color = 'green';
	    		}
	    		else if (self.lastBtcValue() > self.currentBtcValue()) {
	    			color = 'red';
	    		}
	    		
	    		if (self.lastBtcFloat()) {
		    		var difference = parseFloat(self.currentBtcFloat()) - parseFloat(self.lastBtcFloat());
		    		difference = Number((difference).toFixed(4));
	    		}
		    	
	    		var currentTimestamp = new Date();
	    		var currentTimeFormat = [ (currentTimestamp.getMonth()+1).padLeft(),
	    		                          currentTimestamp.getDate().padLeft(),
	    		                          currentTimestamp.getFullYear()].join('/')+
	    		                          ' ' +
	    		                          [ currentTimestamp.getHours().padLeft(),
	    		                            currentTimestamp.getMinutes().padLeft(),
	    		                            currentTimestamp.getSeconds().padLeft()].join(':');

			    if (self.lastBtcValue() === 0 || (self.lastBtcValue() != self.currentBtcValue())) {	
			    	self.btcValueArray.unshift({value: btcValue, timeStamp: currentTimeFormat, color: color, difference: difference});
			    	if (self.btcValueArray().length > 100) {
			    		self.btcValueArray().pop();
			    	}

			    }

			    self.btcValueGraphArray.push([currentTimestamp.getTime(), btcFloat]);
			    
		    	if (self.btcValueGraphArray().length > 1000) {
		    		self.btcValueGraphArray().pop();
		    	}

	    		self.lastBtcValue(self.currentBtcValue());
		    	self.lastBtcFloat(self.currentBtcFloat());
		    	
		    	self.btcPolling(false);
		    });
	    }
	    
	    this.getBtcValue();
	    self.interval(setInterval(this.getBtcValue, this.updateInterval()*1000));

	    
	    this.updateInterval.subscribe(function(newInterval) {
	    	clearInterval(self.interval());
		    self.interval(setInterval(self.getBtcValue, newInterval*1000));
	    });
	    

		// Set up the control widget
	    this.timer = ko.observable(0);
	    this.formattedTimer = ko.observable('00:00');
	    this.random = ko.observable();

	    this.tick = function() {
	    	var value = self.timer()+1;
	    	// keep call timer under an hour
	    	if (value < 3600) {
	    		self.timer(value);
	    		self.formatTimer();
	    	}
	    	else {
	    		clearInterval(self.interval());
	    		self.timer(0);
	    		self.formattedTimer('--:--');
	    	}
	    };

	    this.startTimer = function() {
	    	if (typeof self.interval() == "undefined") {
	    		self.interval(setInterval(this.tick, 1));
	    	}
	    };
	    
	    this.stopTimer = function() {
	    	clearInterval(self.interval());
	    	self.interval(undefined);
	    };
	    
	    this.resetTimer = function() {
	    	self.timer(0);
	    	self.formattedTimer('00:00');
	    	self.stopTimer();
	    };
	    
	    this.resetStartTimer = function() {
	    	self.resetTimer();
	    	self.startTimer();
	    }
	    
	    this.formatTimer = function() {
	    	var minutes = ('0'+Math.round(self.timer()/60)).slice(-2);
	    	var seconds = ('0'+self.timer()%60).slice(-2);
	    	var formattedTimer = minutes+':'+seconds;
	    	self.formattedTimer(formattedTimer);
	    }
	};

	ko.applyBindings(new viewModel());
    //jQuery, canvas and the app/sub module are all
    //loaded and can be used here now.
});
