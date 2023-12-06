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
    let GetPageName = GatePassNo.slice(0,5); 
    this.GetPageNo = GatePassNo.slice(0,5); 

  if(GetPageName === "10002"){ // ================ General Purchase 10002 ==========
    var oFilter1 = new sap.ui.model.Filter("Id", sap.ui.model.FilterOperator.EQ, GatePassNo);
    var oModel1 = this.getView().getModel("YY1_GENERAL_PURCHASE_CDS"); // Replace with your actual OData model name
    var oFilters1 = [oFilter1];
    var EntitySet = "/YY1_TO_ITEM_GENERAL_PURCHASE"
    var TiTleData = "General Purchase"
  }

  else if(GetPageName === "10001"){ // ================ Cash Purchase 10001 ==========
    var oFilter1 = new sap.ui.model.Filter("Id", sap.ui.model.FilterOperator.EQ, GatePassNo);
    var oModel1 = this.getView().getModel("YY1_CASH_PURCHASE_CDS"); // Replace with your actual OData model name
    var oFilters1 = [oFilter1];
    var EntitySet = "/YY1_ITEM_CASH_PURCHASE"
    var TiTleData = "Cash Purchase"
  }

    // ===============Cash Purchase 10001 =====================================================

    

  var that = this;

  oModel1.read(EntitySet, {
    filters:[oFilters1],

      success: function (oData) {

          var aItems = oData.results; // The array of read items
          console.log(aItems)

          var oJSONModelfrag = new sap.ui.model.json.JSONModel({
            data:aItems
          });
          that.getView().setModel(oJSONModelfrag, "JModelfrag");

          var TitleFrag = new sap.ui.model.json.JSONModel({
            data:TiTleData
          });
          that.getView().setModel(TitleFrag, "Title");

          var GatePassNoFrag = new sap.ui.model.json.JSONModel({
            data:GetPageName
          });
          that.getView().setModel(GatePassNoFrag, "GatePassNoFrag");

      },

      error: function (oError) {
          console.error("Error reading data: ", oError);

      }
  
  })
// ====================================================================

    

  if (!this.oFilterFrag)
     this.oFilterFrag = sap.ui.xmlfragment("gatepass.view.approve.fragment.show", this);
     this.getView().addDependent(this.oFilterFrag)
    this.oFilterFrag.open();
  },

  // OnVisibleCon:function(GPNo){
  //   var Dataa = this.GetPageNo;
        
  //         var data = new Promise(function (resolve) {

  //           if(Dataa === "10002" && Dataa !== "10001" ){

  //           var Status = true;

  //           }else{
  //             var Status = false;
  //           }
            
  //           resolve(Status);
  //         });
  //       return data;

  // },

  OnApprove : function() {
  this.oFilterFrag.destroy();
  this.oFilterFrag = undefined;

  var oJSONModelfrag = new sap.ui.model.json.JSONModel({
    data:{}
  });

    },

    OnReject:function(){

      // ------- Loder Model Boc Open - Enable ----------------
      if (!this._pBusyDialog) {
          this._pBusyDialog = sap.ui.xmlfragment(this.getView().getId("BusyDialog"), "gatepass.view.fragments.BusyIndicator", this);
          this.getView().addDependent(this._pBusyDialog);
      }
      this._pBusyDialog.open();
      // ------- Loder Model Boc Open - Enable ----------------

      let General_Purchase_Document = this.getView().byId("General_Purchase_Document_H").getValue();
      let SAP_UUID_H = this.getView().byId("SAP_UUID_H").getValue();

      // ---------- Start Item Level

      var Table_Id = this.getView().byId("persoTable");
      var Table_Length = Table_Id.getRows().length;

      for (var i = 0; i < Table_Length; i++) {
      var oRow = Table_Id.getRows()[i];
      var oBindingContext = oRow.mAggregations;

      if (oBindingContext) {
          var Gate_Quantity_To_Post = oBindingContext.cells[7].mProperties.value;
          var SAP_UUID_I = oBindingContext.cells[18].mProperties.value;
          var Delete_Status01 = oRow.getCells()[0].getVisible();

          if (Gate_Quantity_To_Post !== "") {
              var Delete_Status = "deleted";
              
          var itemData = {
              Status: Delete_Status
          };

          var oModel_04 = this.getView().getModel("YY1_GENERAL_PURCHASE_CDS");
          oModel_04.setHeaders({
              "X-Requested-With": "X",
              "Content-Type": "application/json"
          });

          oModel_04.update("/YY1_TO_ITEM_GENERAL_PURCHASE(guid'" + SAP_UUID_I + "')", itemData, {
              success: function(data) {
              console.log("Item Updated:", data);
              },
              error: function(error) {
              console.error("Error updating item:", error);
              }
          });
          }
      }
      }

      var oEntry1 = {
          Status: "deleted",
      };

      var that = this;

      var oModel05 = this.getView().getModel("YY1_GENERAL_PURCHASE_CDS");
      oModel05.setHeaders({
      "X-Requested-With": "X",
      "Content-Type": "application/json"
      });

      oModel05.update("/YY1_GENERAL_PURCHASE(guid'" + SAP_UUID_H + "')", oEntry1, {
      success: function(data) {
          console.log("Header Updated:", data);
          that._pBusyDialog.close();
          MessageToast.show(" "+General_Purchase_Document+" Deleted")        
          oModel05.refresh(true);
          that.getView().byId("DeleteIndicId").setVisible(true); 
          that.getView().byId("Final_Update_Button").setVisible(false); 
          that.getView().byId("Final_DeleteEntireDocument_Button").setVisible(false); 
          that.getView().byId("Final_Cancel_Button").setVisible(false); 
          that.getView().byId("UnFinal_DeleteEntireDocument_Button").setVisible(true); 
      },
      error: function(error) {
          console.error("Error updating header:", error);
          that._pBusyDialog.close();
          MessageToast.show(" "+General_Purchase_Document+" Not Deleted")
      }
      });

          
      

      // ---------- End Item Level

  },

      });
    }
  );
  