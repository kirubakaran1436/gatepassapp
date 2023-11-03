sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/m/MessageBox",
        "sap/m/MessageToast",
        "sap/ui/core/Fragment",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/ui/unified/DateTypeRange",
        "sap/ui/core/date/UI5Date",
        "sap/ui/model/json/JSONModel",
    ],
    function(BaseController) {
      "use strict";
  
      return BaseController.extend("gatepass.controller.approve.head_approve", {
        onInit() {

          // var oModel = new sap.ui.model.json.JSONModel();

          // oModel.loadData("/sap/bc/ui2/start_up");

          // console.log(oModel);

          this.Business_User = "Krishna Murthy";

        
        
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.getRoute("head_approve").attachPatternMatched(this._onRouteMatched, this);
        
        },

        _onRouteMatched: function(oEvent){

          var oJSONModel = new sap.ui.model.json.JSONModel({
            data:{}
          });

          this.getView().setModel(oJSONModel, "JModel");

          if (!this._dialog001) {
            this._dialog001 = sap.ui.xmlfragment(this.getView().getId("BUser_dialog"), "gatepass.view.approve.fragment.Business_User_Box", this);
            this.getView().addDependent(this._dialog001);
        }
        this._dialog001.open();
        },

        

          OnBUserSearch: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter("PersonFullName", FilterOperator.Contains, sValue);
            var oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([oFilter]);
        },

        OnBUserSelect: function (oEvent) {
            var oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([]);

            var aContexts = oEvent.getParameter("selectedContexts");
            console.log(aContexts)
            var var1, var2;

            if (aContexts && aContexts.length) {

                aContexts.map(function (oContext) {
                    var1 = oContext.getObject().PersonFullName;
                    var2 = oContext.getObject().UserID;
                    return;
                });

                // ========================================================================
                var filter01 = new sap.ui.model.Filter("approve_person_name", sap.ui.model.FilterOperator.EQ, var1);
                var filter02 = new sap.ui.model.Filter("approve_status", sap.ui.model.FilterOperator.EQ, "pending");
                var model0 = this.getOwnerComponent().getModel("YY1_GATEPASS_ALL_DATA_CDS");
                var that = this;
                model0.read("/YY1_GATEPASS_ALL_DATA", {
                  filters:[filter01, filter02],
                  success: function (oData) {
                  var oJSONModel = new sap.ui.model.json.JSONModel({
                      data: oData.results
                  });
                  that.getView().setModel(oJSONModel, "JModel");
                  },
                  error: function (oError) {
                      console.log(oError);
                      }
              });

              this.getOwnerComponent().getModel("YY1_GATEPASS_ALL_DATA_CDS").read("/YY1_GATEPASS_ALL_DATA/$count", { /* Decalure Globally in the Create table Serial Number */
              success: $.proxy(function (oEvent, oResponse) {
                          let Count = Number(oResponse.body) ; // This should be a number, no need to use Number()
                          this.getView().byId("Total_Pending").setNumber(Count);
              }, this)
                });

              
                // ========================================================================
                      
                this.getView().byId("BUser_Combo").setSelectedItem(var1);
                this.getView().byId("BUser_Combo").setSelectedItemId(var2);
                this.getView().byId("BUser_Combo").setSelectedKey(var2);

                if(this.Business_User === var1){
                  this.getView().byId("TableId").setSelectionMode("MultiToggle");
                  this.getView().byId("accept").setEnabled(true);
                  this.getView().byId("reject").setEnabled(true);
                }else{
                  this.getView().byId("TableId").setSelectionMode("None");
                  this.getView().byId("accept").setEnabled(false);
                  this.getView().byId("reject").setEnabled(false);
                }
               
            }
        },

        OnUserChange:function(oEvent){
          var BUser_Key = oEvent.oSource.getSelectedItem().getKey();
          var BUser_Name = oEvent.oSource.getSelectedItem().getText();

          // ========================================================================
          var filter01 = new sap.ui.model.Filter("approve_person_name", sap.ui.model.FilterOperator.EQ, BUser_Name);
          var filter02 = new sap.ui.model.Filter("approve_status", sap.ui.model.FilterOperator.EQ, "pending");
          var model0 = this.getOwnerComponent().getModel("YY1_GATEPASS_ALL_DATA_CDS");
          var that = this;
          model0.read("/YY1_GATEPASS_ALL_DATA", {
            filters:[filter01, filter02],
            success: function (oData) {
            var oJSONModel = new sap.ui.model.json.JSONModel({
                data: oData.results
            });
            that.getView().setModel(oJSONModel, "JModel");
            },
            error: function (oError) {
                console.log(oError);
                }
        });

          // ========================================================================

          if(this.Business_User === BUser_Name){
            this.getView().byId("TableId").setSelectionMode("MultiToggle");
            this.getView().byId("accept").setEnabled(true);
            this.getView().byId("reject").setEnabled(true);
          }else{
            this.getView().byId("TableId").setSelectionMode("None");
            this.getView().byId("accept").setEnabled(false);
            this.getView().byId("reject").setEnabled(false);
          }
        },

        OnGatePassPageChange:function(oEvent){
          var GPass_Key = oEvent.oSource.getSelectedItem().getKey();
          var GPass_Name = oEvent.oSource.getSelectedItem().getText();
          var BUser_Name = this.getView().byId("BUser_Combo").getValue();

          // ========================================================================
          var filter01 = new sap.ui.model.Filter("approve_person_name", sap.ui.model.FilterOperator.EQ, BUser_Name);
          var filter02 = new sap.ui.model.Filter("approve_status", sap.ui.model.FilterOperator.EQ, "pending");
          

          var model0 = this.getOwnerComponent().getModel("YY1_GATEPASS_ALL_DATA_CDS");
          var that = this;
          model0.read("/YY1_GATEPASS_ALL_DATA", {
            filters:[filter01, filter02],
            success: function (oData) {
              console.log(oData);
            // var oJSONModel = new sap.ui.model.json.JSONModel({
            //     data: oData.results
            // });
            that.getView().setModel(oJSONModel, "JModel");
            },
            error: function (oError) {
                console.log(oError);
                }
        });

          // ========================================================================

          if(this.Business_User === BUser_Name){
            this.getView().byId("TableId").setSelectionMode("MultiToggle");
            this.getView().byId("accept").setEnabled(true);
            this.getView().byId("reject").setEnabled(true);
          }else{
            this.getView().byId("TableId").setSelectionMode("None");
            this.getView().byId("accept").setEnabled(false);
            this.getView().byId("reject").setEnabled(false);
          }
        },

  //       OnGatePassState:function(Value1){

  //         let Dataa1 = Value1;

  //         var data = new Promise(function (resolve) {

  //           let Dataa1 = Dataa;
            
  //           resolve(Dataa1);
  //     });
  // return data;

  //       },

  OnFragOpen:function(oEvent){

    let GatePassNo = oEvent.getSource().getParent().getCells()[0].getText(); 

  // ====================================================================

  var oFilter1 = new sap.ui.model.Filter("Id", sap.ui.model.FilterOperator.EQ, GatePassNo);
  var oModel1 = this.getView().getModel("YY1_GENERAL_PURCHASE_CDS"); // Replace with your actual OData model name
  var oFilters1 = [oFilter1];
  var that = this;

  oModel1.read("/YY1_TO_ITEM_GENERAL_PURCHASE", {
    filters:[oFilter1],

      success: function (oData) {

          var aItems = oData.results; // The array of read items
          console.log(aItems)

          var oJSONModelfrag = new sap.ui.model.json.JSONModel({
            data:aItems
          });

          that.getView().setModel(oJSONModelfrag, "JModelfrag");

      },

      error: function (oError) {
          console.error("Error reading data: ", oError);

      }
  
  })
// ====================================================================

// if (!this._dialog002) {
//   this._dialog002 = sap.ui.xmlfragment(this.getView().getId("TableId"), "gatepass.view.approve.fragment.show", this);
//   this.getView().addDependent(this._dialog002);
// }
// this._dialog002.open();

  

  if (!this.oFilterFrag)
     this.oFilterFrag = sap.ui.xmlfragment("gatepass.view.approve.fragment.show", this);
    this.oFilterFrag.open();
  },

  OnApprove : function() {
  this.oFilterFrag.destroy();
  this.oFilterFrag = undefined;

},

      });
    }
  );
  