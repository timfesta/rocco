$(function() {
  // console.log("Ello Gubna")


  var baseUrl = "http://localhost:3000" // DEV
  // var baseUrl = "https://holidaytrading.herokuapp.com/" // PRD


  //----- TEMPLATE - inputs into html-----=---//
  var $stock = _.template($("#stockTemplate").html())


  //--- Client makes a request to server "i need the stocks"---///
  //--- THIS HAPPENS WHEN YOU LOAD THE PAGE ----////
  // $.get('/api/stocks').done(function(data) {
  // // --- when it is done backend given to front end 
  //   _.each(data, function(stocks) {
  //       $('#stocks').append($stock(stocks))
  //     });
  //  });


  $.get('/api/stocks').done(function(data) {
  // --- when it is done backend given to front end 
    console.log(data)
    _.each(data, function(stocks) {
        $('#stocks').append($stock({stock: stocks}));
      });
   });
            

  //-------------EVENT LISTENER---------------//
  //---- THIS HAPPENS WHEN YOU SUBMIT A NAME ---///
  $('#new-stock').submit(function (event){
      event.preventDefault();
      console.log("Dont trip chocolate chip")

  //-----GRABBING THE VALUE FROM THE INPUT LINE----//
  var userInput = {
        text: $('#stockText').val()
  }

  var BASE_URL = "http://query.yahooapis.com/v1/public/yql?q=";
  var ygl_query = 'select * from yahoo.finance.quote where symbol in ("AAPL","AXP","BA","CAT","CSCO","CVX","DD","DIS","GE","GS","HD","IBM","INTC","JNJ","JPM","KO","MCD","MMM","MRK","MSFT","NKE","PFE","PG","TRV","UNH","UTX","V","VZ","WMT","XOM")'
  var ygl_query_str = encodeURI(BASE_URL+ygl_query);
  var query_str_final = ygl_query_str + "&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys"
  

  $.getJSON(query_str_final, function (data) {
    for(var i = 0; i < data.query.results.quote.length; i++) {
      var quoteObject = data.query.results.quote[i];
      if(quoteObject.symbol === userInput.text) { 
        $('#stocks').append($stock({stock: quoteObject}));
        

        $.post('/api/stocks', quoteObject).done(function(data) {
          console.log(data);
          $('#stockText').val('');
        });


        } else {
          console.log('hey this didnt work')
        }
      }
  });




  //Go through with for loop, each, .quotes array with this userInput name
  //find the object with the same symbol as the userInput 
  //using an if statement like symbol === userInput
  //append it on the screen

  //- grabs the data from the input line runs it through template and adds to list--//
  // $('#stocks').append($stock(userInput))


  //-----POSTS TO ROUTE API/STOCKS--------------//
  });
});