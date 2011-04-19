function main()
{
   var station = args.query;
   
   if (station != null)
   {
	   http://xn--tg-yia.info/stationer.xml
	     //var uriSweden = "http://api.xn--senatg-mua.se/beta/stations/name/" +stringUtils.urlEncode(station) + "?format=json",  
         //var uriSweden = "http://api.xn--senatg-mua.se/beta/stations/?format=json&take=1000"
	     var uriSweden = "http://xn--tg-yia.info/stationer.json"
		 connector = remote.connect("http"),
         result = connector.get(uriSweden);
      if (result.status == status.STATUS_OK)
      {
         model.jsonResp = result.response;
      }
      else
      {
         status.setCode(result.status, "Error during remote call. " +
               "Status: " + result.status + ", Response: " + result.response);
         status.redirect = true;
      }
   }
   else
   {
      status.setCode(status.STATUS_BAD_REQUEST, "No query was specifed");
      status.redirect = true;
   }
}
main();