/**
 * Copyright (C) 2005-2009 Alfresco Software Limited.
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.

 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.

 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA.

 * As a special exception to the terms and conditions of version 2.0 of 
 * the GPL, you may redistribute this Program in connection with Free/Libre 
 * and Open Source Software ("FLOSS") applications as described in Alfresco's 
 * FLOSS exception.  You should have recieved a copy of the text describing 
 * the FLOSS exception, and it is also available here: 
 * http://www.alfresco.com/legal/licensing
 */
 
/**
 * Dashboard Poll component.
 * 
 * @namespace Alfresco
 * @class Alfresco.dashlet.TrainTimes
 */
(function()
{
   /**
    * YUI Library aliases
    */
   var Dom = YAHOO.util.Dom,
      Event = YAHOO.util.Event;

   /**
    * Alfresco Slingshot aliases
    */
   var $html = Alfresco.util.encodeHTML,
      $combine = Alfresco.util.combinePaths;

   /**
    * Dashboard TrainTimes constructor.
    * 
    * @param {String} htmlId The HTML id of the parent element
    * @return {Alfresco.dashlet.TrainTimes} The new component instance
    * @constructor
    */
   Alfresco.dashlet.TrainTimes = function TrainTimes_constructor(htmlId)
   {
      return Alfresco.dashlet.TrainTimes.superclass.constructor.call(this, "Alfresco.dashlet.TrainTimes", htmlId, ["datatable", "datasource", "paginator", "autocomplete"]);
   };

   /**
    * Extend from Alfresco.component.Base and add class implementation
    */
   YAHOO.extend(Alfresco.dashlet.TrainTimes, Alfresco.component.Base,
   {
      /**
       * Object container for initialization options
       *
       * @property options
       * @type object
       */
      options:
      {
         /**
          * The component id.
          *
          * @property componentId
          * @type string
          */
         componentId: "",
      
         /**
          * The station to display train times for
          *
          * @property station
          * @type string
          * @default ""
          */
         station: "",
      
         /**
          * If set only display trains stopping via
          *
          * @property stationVia
          * @type string
          * @default ""
          */
         stationVia: "",
      
         /**
          * Number of trains to display per page
          *
          * @property pageSize
          * @type int
          * @default 10
          */
         pageSize: 10
      },
      
      /**
       * Body div object
       * 
       * @property bodyContainer
       * @type object
       * @default null
       */
      bodyContainer: null,
      
      /**
       * Trains datatable div object
       * 
       * @property trainsContainer
       * @type object
       * @default null
       */
      trainsContainer: null,
      
      /**
       * Service updates div object
       * 
       * @property updatesContainer
       * @type object
       * @default null
       */
      updatesContainer: null,
      
      /**
       * Message div object
       * 
       * @property messageContainer
       * @type object
       * @default null
       */
      messageContainer: null,
      
      /**
       * Title div object
       * 
       * @property titleContainer
       * @type object
       * @default null
       */
      titleContainer: null,
      
      /**
       * Datatable object
       * 
       * @property dataTable
       * @type object
       * @default null
       */
      dataTable: null,
      
      /**
       * Datasource object
       * 
       * @property dataSource
       * @type object
       * @default null
       */
      dataSource: null,

      /**
       * Fired by YUI when parent element is available for scripting
       * 
       * @method onReady
       */
      onReady: function TrainTimes_onReady()
      {
         this.titleContainer = Dom.get(this.id + "-title");
         this.bodyContainer = Dom.get(this.id + "-body");
         this.trainsContainer = Dom.get(this.id + "-trains");
         this.messageContainer = Dom.get(this.id + "-message");
         this.updatesContainer = Dom.get(this.id + "-updates");
         
         Event.addListener(this.id + "-configure-link", "click", this.onConfigClick, this, true);
         Event.addListener(this.id + "-refresh", "click", this.onRefresh, this, true);
         
         this.init();
      },

      /**
       * Initialise the display of the dashlet
       * 
       * @method init
       */
      init: function TrainTimes_init()
      {
         // Set the title
         if (this.options.station != "")
         {
            this.titleContainer.innerHTML = this.msg("header.departures", this.options.station);
         }
         else
         {
            this.titleContainer.innerHTML = this.msg("header.default");
         }
         // Load the data
         if (this.dataTable)
         {
            this.dataTable.destroy();
         }
         if (this.options.station != "")
         {
            this.loadData();
            this.setMessage(); // Hide any message text
         }
         else
         {
            this.setMessage(this.msg("msg.notConfigured"));
         }
      },
      
      /**
       * Set a message text to display to the user
       * 
       * @method setMessage
       * @param msg {string} Message text to set
       */
      setMessage: function TrainTimes_setMessage(msgText)
      {
         if (msgText)
         {
            this.messageContainer.innerHTML = msgText;
            Dom.setStyle(this.messageContainer, "display", "block");
         }
         else
         {
            this.messageContainer.innerHTML = "";
            Dom.setStyle(this.messageContainer, "display", "none");
         }
      },
      
      /**
       * Load train times and render in the dashlet
       * 
       * @method loadResults
       */
      loadData: function TrainTimes_loadData()
      {
    	  
    	  function isEmpty(ob){
    		   for(var i in ob){ return false;}
    		  return true;
    	  }

    	  var formatBerTid = function(elCell, oRecord, oColumn, sData) { 
     		 //elCell.innerHTML = (isEmpty(sData)) ? "i tid" : YAHOO.util.Date.format(sData, '%T'); 
     		 
     		 if (isEmpty(sData)){
     			 elCell.innerHTML = "i tid";
     		 }else{
     			 elCell.innerHTML = YAHOO.util.Date.format(sData, '%T');
     			 Dom.addClass(elCell, "delayed");
     		 }
    		 //Dom.addClass(elCell.parentNode, "delayed"); 
    		 //Dom.addClass(elCell, "delayed");
    	 }; 
    	     	 
    	 var formatSpar = function(elCell, oRecord, oColumn, sData) { 
    		 console.log("formatSpar");
   	      elCell.innerHTML = (isEmpty(sData)) ? "ok&auml;nt" : sData; 
    	 }; 

    	 var myColumnDefs = [
              {key:"tid", label: this.msg("th.time"), formatter:YAHOO.widget.DataTable.formatTime, sortable:true, resizeable:true},
              {key:"berTid", label: this.msg("th.expected"), formatter:formatBerTid, sortable:true, resizeable:true},
              {key:"till", label: this.msg("th.destination"), sortable:true,resizeable:true},
              {key:"spar", label: this.msg("th.platform"), formatter:formatSpar, sortable:true, resizeable:true}
          ];
    	 
    	  var myDataSource = new YAHOO.util.DataSource(Alfresco.constants.URL_SERVICECONTEXT + 
                "components/dashlets/uk-train-times/train-data?station=" + 
                encodeURI(this.options.station));
          myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSON;
          myDataSource.responseSchema = {
              resultsList: "Response.avgaende.tag",
              fields: ["tid", 
                       "till", 
                       "spar",
                       "berTid"]
          };
          myDataSource.subscribe("responseEvent", function(oArgs) {
             
          });

          var dtOptions = {
                //formatRow: rowFormatter,
                paginator: new YAHOO.widget.Paginator(
                {
                   rowsPerPage: this.options.pageSize, 
                   firstPageLinkLabel : this.msg("firstPageLinkLabel"), 
                   previousPageLinkLabel : this.msg("previousPageLinkLabel"), 
                   nextPageLinkLabel : this.msg("nextPageLinkLabel"), 
                   lastPageLinkLabel : this.msg("lastPageLinkLabel"), 
                   pageReportTemplate : this.msg("pageReportTemplate")
                }),
                MSG_EMPTY: this.msg("msg.noTrains"),
                MSG_LOADING: this.msg("msg.loading")
          };
          var myDataTable = new YAHOO.widget.DataTable(this.trainsContainer,
                 myColumnDefs, myDataSource, dtOptions);
          
          var me = this;
          
          myDataTable.handleDataReturnPayload = function(oRequest, oResponse, oPayload)
          {
             // Add service updates to the dashlet
             if (oResponse.meta.updates && oResponse.meta.updates.length > 0)
             {
                var html = "";
                for ( var i = 0; i < oResponse.meta.updates.length; i++)
                {
                   html += "<div class=\"update\">" +
                      me._htmlDecode(oResponse.meta.updates[i].text) +
                      "</div>";
                }
                me.updatesContainer.innerHTML = html;
                Dom.setStyle(me.updatesContainer, "display", "block");
             }
             else
             {
                Dom.setStyle(me.updatesContainer, "display", "none");
             }
             return oPayload;
          };

          this.dataSource = myDataSource;
          this.dataTable = myDataTable;
      },
      
      /**
       * Replace HTML-encoded entities in text with their non-encoded equivalents
       * 
       * @method _htmlDecode
       * @param text {string} HTML-encoded text to be decoded
       * @private
       */
      _htmlDecode: function TrainTimes_urlDecode(text)
      {
         return text.replace("&lt;", "<", "g").replace("&gt;", ">", "g").replace("&amp;", "&", "g").replace("&quot;", "\"", "g").replace("&#034;", "\"", "g");
      },
      
      /**
       * Refresh train times data
       * 
       * @method refresh
       */
      refresh: function TrainTimes_refesh()
      {
      // Sends a request to the DataSource for more data
         var oCallback = {
             success : this.dataTable.onDataReturnInitializeTable,
             failure : this.dataTable.onDataReturnInitializeTable,
             scope : this.dataTable,
             argument: this.dataTable.getState() // data payload that will be returned to the callback function
         };
         this.dataSource.sendRequest("", oCallback);

      },

      /**
       * YUI WIDGET EVENT HANDLERS
       * Handlers for standard events fired from YUI widgets, e.g. "click"
       */

      /**
       * Event handler for refresh click
       * @method onRefresh
       * @param e {object} Event
       */
      onRefresh: function TrainTimes_onRefresh(e)
      {
         if (e)
         {
            // Stop browser's default click behaviour for the link
            Event.preventDefault(e);
         }
         this.refresh();
      },
      
      /**
       * Configuration click handler
       *
       * @method onConfigClick
       * @param e {object} HTML event
       */
      onConfigClick: function TrainTimes_onConfigClick(e)
      {
         var actionUrl = Alfresco.constants.URL_SERVICECONTEXT + "modules/dashlet/config/" + encodeURIComponent(this.options.componentId);
         
         Event.stopEvent(e);
         
         if (!this.configDialog)
         {
            this.configDialog = new Alfresco.module.SimpleDialog(this.id + "-configDialog").setOptions(
            {
               width: "50em",
               templateUrl: Alfresco.constants.URL_SERVICECONTEXT + "modules/dashlet/uk-train-times/config",
               actionUrl: actionUrl,
               onSuccess:
               {
                  fn: function TrainTimes_onConfigPoll_callback(e)
                  {
                     this.options.station = Dom.get(this.configDialog.id + "-station").value;
                     this.init();
                  },
                  scope: this
               },
               doSetupFormsValidation:
               {
                  fn: function TrainTimes_doSetupForm_callback(form)
                  {
                     Dom.get(this.configDialog.id + "-station").value = this.options.station;
                     
                     // Define AutoComplete controls
                     
                     // Use a XHRDataSource
                     var oDS = new YAHOO.util.XHRDataSource(Alfresco.constants.URL_SERVICECONTEXT + "modules/dashlets/uk-train-times/station-data");
                     // Set the responseType
                     oDS.responseType = YAHOO.util.XHRDataSource.TYPE_JSON;
                     oDS.responseSchema = {
                           resultsList: "station",
                           fields : ["namn", "url", "lat", "long"]
                     };
                     oDS.maxCacheEntries = 3000;

                     // Custom AutoComplete result formatter
                     var formatResult = function(oResultData, sQuery, sResultMatch) {
                         return oResultData.namn
                     };

                     // Custom event handler to ensure the name gets saved, not the code
                     var myHandler = function(sType, aArgs) {
                         var myAC = aArgs[0]; // reference back to the AC instance
                         var elLI = aArgs[1]; // reference to the selected LI element
                         var oData = aArgs[2]; // object literal of selected item's result data
                         
                         myAC.getInputEl().value = oData.display ? oData.display : oData.namn; 
                     };
                     
                     // Instantiate the station AutoComplete
                     var oAC = new YAHOO.widget.AutoComplete(this.configDialog.id + "-station", this.configDialog.id + "-station-select", oDS);
                     oAC.useShadow = true;
                     oAC.applyLocalFilter = true;
                     oAC.resultTypeList = false;
                     oAC.formatResult = formatResult;
                     oAC.itemSelectEvent.subscribe(myHandler);

                     // Instantiate the via AutoComplete
                     //var viaAC = new YAHOO.widget.AutoComplete(this.configDialog.id + "-via", this.configDialog.id + "-via-select", oDS);
                     //viaAC.useShadow = true;
                     //viaAC.resultTypeList = false;
                     //viaAC.formatResult = formatResult;
                     //viaAC.itemSelectEvent.subscribe(myHandler);
                  },
                  scope: this
               }
            });
         }
         else
         {
            this.configDialog.setOptions(
            {
               actionUrl: actionUrl
            });
         }
         
         this.configDialog.show();
      }
   });
})();
