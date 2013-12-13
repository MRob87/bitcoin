<!DOCTYPE html>
<html>
    <head>
    <link rel="stylesheet" type="text/css" href="css/jquery.flot.css">
        <title>Bitcoin</title>
        <!-- data-main attribute tells require.js to load
             scripts/main.js after require.js loads. -->
        <script data-main="bitcoin.js" src="js/require.js"></script>
        
        <script type="text/javascript">
        </script>
    </head>
    <body><br/>
        <table style="width: 100%;"><tr><td style="width: 60%">
        	<div style="overflow: scroll; height: 200px; overflow-x: hidden;">
		        <table style="border: 1px 1px 1px 1px black solid; width: 100%;">
		        	<tr>
		        	<thead>Bitcoin Value History 
		        	<p>Time between updates: <input data-bind="value: updateInterval, valueUpdate: 'afterkeydown'" type="text" style="text-align: right; width:5em"> seconds</p>
		        	Show Delta: <input type="checkbox" data-bind="checked: showDelta">
		        	</thead>
		        	<th>Timestamp</th>
		        	<th>BTC Value in USD</th>
				     <!-- ko if: showDelta() -->
		        		<th>Change/Delta</th>
		        	<!-- /ko -->
		        	<tbody data-bind="foreach: btcValueArray">
				        <tr data-bind="style: { background: $index()%2 ? '#CCCCCC' : '#FFFFFF' }">
				        	<td style="width: 40%">
				        		<span data-bind="text: timeStamp"></span>
				        	</td>
				        	<td style="width: 35%">
				        		<span data-bind="text: value, style: { color: color }"></span><br/>
				        	</td>
				        	<!-- ko if: $parent.showDelta() -->
				        	<td style="width: 25%">
				        		<span data-bind="if: difference > 0, style: { color: color }">+</span><span data-bind="text: difference, style: { color: color }"></span><br/>
				        	</td>
				        	<!-- /ko -->
				        </tr>
			        </tbody>
		        </table>
		    </div>
		    
			<table style="width: 100%">
				<tr><td style="width: 50%"><b>Amount you paid </b></td>
				<Td style="width: 50%"><input data-bind="value: purchasedBtcCost, valueUpdate: 'afterkeydown'"> </td></tr>
				<tr><td><b>Amount of BTC you have at that price </b></td>
				<Td><input data-bind="value: purchasedBtcAmount, valueUpdate: 'afterkeydown'"></td></tr>
				<tr><td><b>Purchase Rate </b></td>
				<Td><span data-bind="text: purchaseRate()"></span></td></tr>
				<tr><td><b>Current USD Value </b></td>
				<Td>$<span data-bind="text: currentPurchasedBtcValue()"></span></td></tr>
				<tr><td><b>Profit </b></td>
				<Td><span data-bind="text: currentProfit(), style: {color: currentProfit() > 0 ? 'green' : 'red'}"></span></td></tr>
				<tr><td colspan=2 style="background-color: #CCC">Selling</td></tr>
				<tr><td><b>Number of BTC to sell </b></td>
				<Td><input data-bind="value: sellBtcAmount, valueUpdate: 'afterkeydown'"><span data-bind="if: sellBtcAmount() > purchasedBtcAmount()">That's more than you have!</span></td></tr>
				<tr><td><b>Price </b></td>
				<Td><span data-bind="text: sellPrice(), style: {color: currentProfit() > 0 ? 'green' : 'red'}"></span></td></tr>
				<tr><td><b>Profit </b></td>
				<Td><span data-bind="text: sellProfit(), style: {color: sellProfit() > 0 ? 'green' : 'red'}"></span></td></tr>
			</table>
	    </td><td style="width: 5%"></td><td style="width: 35%">
        
	        <div id="header">
				<span style="font-size: 2em; float: right;">Current BTC Value: <span data-bind="text: currentBtcValue"></span></span>
			</div>
		
			<div id="content" style="float: right;">
		
				<div class="demo-container">
					<div id="placeholder" class="demo-placeholder"></div>
				</div>
		
			</div>
		</td></tr></table>
    </body>
</html>