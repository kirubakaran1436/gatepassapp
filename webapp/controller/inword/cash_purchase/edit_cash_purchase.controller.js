sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
	"sap/m/MessageToast",
    'sap/ui/core/Fragment',
    'sap/ui/model/Filter',
	'sap/ui/model/FilterOperator',
    "sap/ui/unified/DateTypeRange",
	"sap/ui/core/date/UI5Date",
    'sap/ui/model/json/JSONModel',
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageBox, MessageToast, Fragment, Filter, FilterOperator, JSONModel, UI5Date) {
        "use strict";

        return Controller.extend("gatepass.controller.inword.cash_pruchase.edit_cash_pruchase", {
            onInit: function () {

               
            },

            OnBack:function(){
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			        oRouter.navTo("cash_purchase");
            },

              // ------------ General Purchase Document Select Fragment Open Start --------------------
        
        OnCashPurDocNoFrag:function(oEvent){
            if (!this._dialog_CashPurDocNo) {
                this._dialog_CashPurDocNo = sap.ui.xmlfragment(this.getView().getId("GenCashDocNo_dialog"), "gatepass.view.fragments.Cash_Purchase_Doc_No", this);
                this.getView().addDependent(this._dialog_CashPurDocNo);
            }
            this._dialog_CashPurDocNo.open();
        },

        OnCashPurDocNoSearch: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter("Id", FilterOperator.Contains, sValue);
            var oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([oFilter]);
        },

        
        OnCashPurDocNoSelect : function (oEvent) {

            // ------- Loder Model Boc Open - Enable ----------------
            if (!this._pBusyDialog) {
                this._pBusyDialog = sap.ui.xmlfragment(this.getView().getId("BusyDialog"), "gatepass.view.fragments.BusyIndicator", this);
                this.getView().addDependent(this._pBusyDialog);
            }
            this._pBusyDialog.open();
            // ------- Loder Model Boc Open - Enable ----------------

            var oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([]);

            var aContexts = oEvent.getParameter("selectedContexts");

            if (aContexts === undefined){
                console.log("undefined");
                this._pBusyDialog.close();
                let Dataa = this.getView().byId("Cash_Purchase_Document_H").getValue();
                if(Dataa === ""){
                    this.getView().byId("Final_Update_Button").setEnabled(false);
                    this.getView().byId("Final_Delete_Button").setEnabled(false);
                    this.getView().byId("Final_DeleteEntireDocument_Button").setEnabled(false);
                }
                
            }else{

                var CashPurDocNo, SAP_UUID_H;

                if (aContexts && aContexts.length) {
    
                    aContexts.map(function (oContext) {
                        CashPurDocNo = oContext.getObject().Id;
                        SAP_UUID_H = oContext.getObject().SAP_UUID;
                        return;
                    });
                    this.getView().byId("Cash_Purchase_Document_H").setValue(CashPurDocNo);
                    this.getView().byId("SAP_UUID_H").setValue(SAP_UUID_H);
                }
    
                var filter = new sap.ui.model.Filter("Id", sap.ui.model.FilterOperator.EQ, CashPurDocNo);
                var model0 = this.getOwnerComponent().getModel("YY1_CASH_PURCHASE_CDS");
                var that = this;
                model0.read("/YY1_CASH_PURCHASE", {
                    filters: [filter], 
                    success: function (ODat, oRespons) {
                        var value11 = ODat.results[0];  
                        var SAPUIID = value11.SAP_UUID;
                        var Status = value11.Status;

                        that.getView().byId("Plant_H").setValue(value11.Plant);
                        that.getView().byId("Vendor_H").setValue(value11.Vendor);
                        that.getView().byId("No_Of_Packages_H").setValue(value11.No_Of_Packages);
                        that.getView().byId("Vehicle_No_H").setValue(value11.Vehicle_No);
                        that.getView().byId("Partner_Doc_No_H").setValue(value11.Partner_Doc_No);
                        that.getView().byId("Person_Name_H").setValue(value11.Person_Name);

                        if(Status === "deleted"){
                            that.getView().byId("DeleteIndicId").setVisible(true); 
                            that.getView().byId("Final_Update_Button").setVisible(false); 
                            that.getView().byId("Final_DeleteEntireDocument_Button").setVisible(false); 
                            that.getView().byId("Final_Cancel_Button").setVisible(false); 
                            that.getView().byId("UnFinal_DeleteEntireDocument_Button").setVisible(true); 
                        }else{
                            that.getView().byId("DeleteIndicId").setVisible(false); 
                            that.getView().byId("Final_Update_Button").setVisible(true); 
                            that.getView().byId("Final_DeleteEntireDocument_Button").setVisible(true);
                            that.getView().byId("Final_Cancel_Button").setVisible(true);
                            that.getView().byId("UnFinal_DeleteEntireDocument_Button").setVisible(false);
                        }
                        

                        model0.read("/YY1_CASH_PURCHASE(guid'" + SAPUIID + "')/to_Item", {
                            success: function (oData) {
                            var oJSONModel = new sap.ui.model.json.JSONModel({
                                data: oData.results
                            });
                            that.getView().setModel(oJSONModel, "JModel");
                            that._pBusyDialog.close();
                            that.getView().byId("Final_Update_Button").setEnabled(true);
                            that.getView().byId("Final_DeleteEntireDocument_Button").setEnabled(true);
                            that.getView().byId("Final_Delete_Button").setEnabled(true);
                            },
                            error: function (oError) {
                                console.log(oError);
                                that._pBusyDialog.close();
                                that.getView().byId("Final_Update_Button").setEnabled(false);
                                that.getView().byId("Final_DeleteEntireDocument_Button").setEnabled(false);
                                that.getView().byId("Final_Delete_Button").setEnabled(false);
                                }
                        });
                    }
    
                });
    

                console.log(aContexts)

            }
            // that._pBusyDialog.close();
            
        },

        // ------------ Product Fragment Open Start --------------------

        OnProductFragOpen:function(oEvent){
            this.valueHelpIndex = oEvent.getSource().getParent();
            if (!this._dialog_producthead) {
                this._dialog_producthead = sap.ui.xmlfragment(this.getView().getId("Product_dialog"), "gatepass.view.fragments.Product", this);
                this.getView().addDependent(this._dialog_producthead);
            }

            this._dialog_producthead.open();
        },

        OnProductSearch: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter("Product", FilterOperator.Contains, sValue);
            var oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([oFilter]);
        },

        OnProductSelect : function (oEvent) {
            var oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([]);

            var aContexts = oEvent.getParameter("selectedContexts");
            console.log(aContexts)
            var Product, ProductName;

            if (aContexts && aContexts.length) {

                aContexts.map(function (oContext) {
                    ProductName = oContext.getObject().ProductName;
                    console.log(ProductName);
                    return oContext;
                });
                this.valueHelpIndex.getCells()[2].setValue(ProductName);
            }

        }, 

        OnNoOfPackageEnter:function(){
            let getValue = this.getView().byId("No_Of_Packages_H").getValue();
            let OTable = this.getView().byId("cashTable");
            let OTable_Len = OTable.getRows();

            for (let i=0; i < OTable_Len.length; i++){
                OTable.getRows()[i].getCells()[8].setValue(getValue);
            }
        },

        OnVehicleNoEnter:function(){
            let getValue = this.getView().byId("Vehicle_No_H").getValue();
            let OTable = this.getView().byId("cashTable");
            let OTable_Len = OTable.getRows();

            for (let i=0; i < OTable_Len.length; i++){
                OTable.getRows()[i].getCells()[9].setValue(getValue);
            }
        },

        OnPersonNameEnter:function(){
            let getValue = this.getView().byId("Person_Name_H").getValue();
            let OTable = this.getView().byId("cashTable");
            let OTable_Len = OTable.getRows();

            for (let i=0; i < OTable_Len.length; i++){
                OTable.getRows()[i].getCells()[10].setValue(getValue);
            }
        },

        // ----Start Select Items Table Delete
        OnTableRowRemove: function(oEvent) {
            var oTable = this.byId("cashTable");
            var oTableRows = oTable.getRows();
            var aIndices = this.byId("cashTable").getSelectedIndices();
            
            for (let i=0; i < oTableRows.length; i++){
                console.log(i);
                aIndices.forEach(function(Index){
                    if ( i === Index){
                        let Visible_Status = oTable.getRows()[Index].getCells()[0].getVisible();
                        if (Visible_Status === false){
                            oTable.getRows()[Index].getCells()[0];
                            oTable.getRows()[Index].getCells()[0].setVisible(true);
                        }
                        if (Visible_Status === true){
                            oTable.getRows()[Index].getCells()[0];
                            oTable.getRows()[Index].getCells()[0].setVisible(false);
                        }
                        
                    }
                });
                
            }
        },

        OnProductCheck:function(oEvent){
            let SAPUUID =  oEvent.getSource().getParent().getCells()[11].getValue(); 
            let ProductVal =  oEvent.getSource().getParent().getCells()[2].getValue(); 

            if (ProductVal === ""){
                var oFilter01 = new sap.ui.model.Filter("SAP_UUID", sap.ui.model.FilterOperator.EQ, SAPUUID);
                
                let oModel = this.getView().getModel("YY1_CASH_PURCHASE_CDS");
                let oFilters = [oFilter01];
                var that=this;
    
                var CalData = 0;
                    
                    oModel.read("/YY1_ITEM_CASH_PURCHASE", {
                    filters: oFilters,
                    success: function(oData) {
                    var aItems = oData.results;
                    oEvent.getSource().getParent().getCells()[2].setValue(aItems[0].Material_Description);
                    },
                    error: function(oError) {
                    console.error("Error reading data: ", oError);
                    }
                    });
            }
        },

        OnQuantityCheck:function(oEvent){
            let SAPUUID =  oEvent.getSource().getParent().getCells()[11].getValue(); 
            let ProductVal =  oEvent.getSource().getParent().getCells()[3].getValue(); 

            if (ProductVal === ""){
                var oFilter01 = new sap.ui.model.Filter("SAP_UUID", sap.ui.model.FilterOperator.EQ, SAPUUID);
                
                let oModel = this.getView().getModel("YY1_CASH_PURCHASE_CDS");
                let oFilters = [oFilter01];
                var that=this;
    
                var CalData = 0;
                    
                    oModel.read("/YY1_ITEM_CASH_PURCHASE", {
                    filters: oFilters,
                    success: function(oData) {
                    var aItems = oData.results;
                    oEvent.getSource().getParent().getCells()[3].setValue(aItems[0].Quantity);
                    },
                    error: function(oError) {
                    console.error("Error reading data: ", oError);
                    }
                    });
            }
        },

        OnUOMCheck:function(oEvent){
            let SAPUUID =  oEvent.getSource().getParent().getCells()[11].getValue();
            let UOM =  oEvent.getSource().getParent().getCells()[4].getValue(); 

            if (UOM === ""){
                var oFilter01 = new sap.ui.model.Filter("SAP_UUID", sap.ui.model.FilterOperator.EQ, SAPUUID);
                
                let oModel = this.getView().getModel("YY1_CASH_PURCHASE_CDS");
                let oFilters = [oFilter01];
                var that=this;
    
                var CalData = 0;
                    
                    oModel.read("/YY1_ITEM_CASH_PURCHASE", {
                    filters: oFilters,
                    success: function(oData) {
                    var aItems = oData.results;
                    oEvent.getSource().getParent().getCells()[4].setValue(aItems[0].UOM);
                    },
                    error: function(oError) {
                    console.error("Error reading data: ", oError);
                    }
                    });
            }else{
                let UOM01 = UOM.toUpperCase();
                oEvent.getSource().getParent().getCells()[4].setValue(UOM01);
            }

            
        },
        OnAmountCheck:function(oEvent){
            let SAPUUID =  oEvent.getSource().getParent().getCells()[11].getValue(); 
            let ProductVal =  oEvent.getSource().getParent().getCells()[5].getValue(); 

            if (ProductVal === ""){
                var oFilter01 = new sap.ui.model.Filter("SAP_UUID", sap.ui.model.FilterOperator.EQ, SAPUUID);
                
                let oModel = this.getView().getModel("YY1_CASH_PURCHASE_CDS");
                let oFilters = [oFilter01];
                var that=this;
    
                var CalData = 0;
                    
                    oModel.read("/YY1_ITEM_CASH_PURCHASE", {
                    filters: oFilters,
                    success: function(oData) {
                    var aItems = oData.results;
                    oEvent.getSource().getParent().getCells()[5].setValue(aItems[0].Amount);
                    },
                    error: function(oError) {
                    console.error("Error reading data: ", oError);
                    }
                    });
            }
        },

        OnUpdate:function(){

            // ------- Loder Model Boc Open - Enable ----------------
            if (!this._pBusyDialog) {
                this._pBusyDialog = sap.ui.xmlfragment(this.getView().getId("BusyDialog"), "gatepass.view.fragments.BusyIndicator", this);
                this.getView().addDependent(this._pBusyDialog);
            }
            this._pBusyDialog.open();
            // ------- Loder Model Boc Open - Enable ----------------

            let Cash_Purchase_Document = this.getView().byId("Cash_Purchase_Document_H").getValue();
            let SAP_UUID_H = this.getView().byId("SAP_UUID_H").getValue();
            let Plant = this.getView().byId("Plant_H").getValue();
            let Vendor_Name = this.getView().byId("Vendor_H").getValue();
            let Partner_Doc_No = this.getView().byId("Partner_Doc_No_H").getValue();
            let No_Of_Packages = this.getView().byId("No_Of_Packages_H").getValue();
            let Vehicle_No = this.getView().byId("Vehicle_No_H").getValue();
            let Person_Name = this.getView().byId("Person_Name_H").getValue();

            console.log(Cash_Purchase_Document);
            console.log(SAP_UUID_H);
            console.log(Plant);
            console.log(Vendor_Name);
            console.log(Partner_Doc_No);
            console.log(No_Of_Packages);
            console.log(Vehicle_No);
            console.log(Person_Name);

            // ---------- Start Item Level


            var Table_Id = this.getView().byId("cashTable");
            var Table_Length = Table_Id.getRows().length;

            var Plant_array = [];
            var Material_Desc_array = [];
            var Quantity_array = [];
            var UOM_array = [];
            var Amount_array = [];

            for (var i = 0; i < Table_Length; i++) {
            var oRow = Table_Id.getRows()[i];
            var oBindingContext = oRow.mAggregations;

            if (oBindingContext) {
                
                var Plant_I = oBindingContext.cells[1].mProperties.value;
                var Plant01 = Plant.trim();
                if (Plant01 !== "") {
                    Plant_array.push(Plant01);
                }

                var Material_Description = oBindingContext.cells[2].mProperties.value;
                var Material_Description01 = Material_Description.trim();
                if (Material_Description01 !== "") {
                    Material_Desc_array.push(Material_Description01);
                    Table_Id.getRows()[i].getCells()[2].setValueState(sap.ui.core.ValueState.None);

                } else {
                    Table_Id.getRows()[i].getCells()[2].setValueState(sap.ui.core.ValueState.Error);
                    Table_Id.getRows()[i].getCells()[2].setValueStateText("Please Enter Material Description");
                    break;
                }

                var Quantity = oBindingContext.cells[3].mProperties.value;
                var Quantity01 = Quantity.trim();
                if (Quantity01 !== "") {
                    Quantity_array.push(Quantity01);
                    Table_Id.getRows()[i].getCells()[3].setValueState(sap.ui.core.ValueState.None);

                } else {
                    Table_Id.getRows()[i].getCells()[3].setValueState(sap.ui.core.ValueState.Error);
                    Table_Id.getRows()[i].getCells()[3].setValueStateText("Please Enter Quantity");
                    // MessageToast.show("Please Fill Quantity");
                    break;
                }

                var UOM = oBindingContext.cells[4].mProperties.value;
                var UOM01 = UOM.trim();
                if (UOM01 !== "") {
                    UOM_array.push(UOM01);
                    Table_Id.getRows()[i].getCells()[4].setValueState(sap.ui.core.ValueState.None);

                } else {
                    Table_Id.getRows()[i].getCells()[4].setValueState(sap.ui.core.ValueState.Error);
                    Table_Id.getRows()[i].getCells()[4].setValueStateText("Please Enter UOM");
                    // MessageToast.show("Please Fill Quantity");
                    break;
                }

                var Amount = oBindingContext.cells[5].mProperties.value;
                var Amount01 = Amount.trim();
                if (Amount01 !== "") {
                    Amount_array.push(Amount01);
                    Table_Id.getRows()[i].getCells()[5].setValueState(sap.ui.core.ValueState.None);

                } else {
                    Table_Id.getRows()[i].getCells()[5].setValueState(sap.ui.core.ValueState.Error);
                    Table_Id.getRows()[i].getCells()[5].setValueStateText("Please Enter Amount");
                    // MessageToast.show("Please Fill Amount");
                    break;
                }

                var SAP_UUID_I = oBindingContext.cells[11].mProperties.value;
                var Delete_Status01 = oRow.getCells()[0].getVisible();

                if (Plant_I !== "") {
                    if(Delete_Status01 === true){
                        var Delete_Status = "deleted";
                    }
                    if (Delete_Status01 === false){
                        var Delete_Status = "";
                    }
                var itemData = {
                    Material_Description: Material_Description,
                    Quantity: Quantity,
                    UOM: UOM,
                    Amount: Amount,
                    No_Of_Packages: No_Of_Packages,
                    Person_Name:Person_Name,
                    Vehicle_No:Vehicle_No,
                    Status: Delete_Status
                };

                var oModel_04 = this.getView().getModel("YY1_CASH_PURCHASE_CDS");
                oModel_04.setHeaders({
                    "X-Requested-With": "X",
                    "Content-Type": "application/json"
                });

                oModel_04.update("/YY1_ITEM_CASH_PURCHASE(guid'" + SAP_UUID_I + "')", itemData, {
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

            // if (Plant_array.length === Material_Desc_array.length && Plant_array.length === Quantity_array.length && Plant_array.length === Quantity_array.length){


            var oEntry1 = {
                No_Of_Packages: No_Of_Packages,
                Person_Name:Person_Name,
                Vehicle_No:Vehicle_No,
                Partner_Doc_No:Partner_Doc_No
            };

            var that = this;

            var oModel05 = this.getView().getModel("YY1_CASH_PURCHASE_CDS");
            oModel05.setHeaders({
            "X-Requested-With": "X",
            "Content-Type": "application/json"
            });

            oModel05.update("/YY1_CASH_PURCHASE(guid'" + SAP_UUID_H + "')", oEntry1, {
            success: function(data) {
                console.log("Header Updated:", data);
                that._pBusyDialog.close();
                MessageBox.success("Document No " + Cash_Purchase_Document + " Updated Successfully", {
                    title: "Change Cash Purchase",
                    id: "messageBoxId1",
                    contentWidth: "100px",
                });                    
                oModel05.refresh(true);
                var oJSONModel = new sap.ui.model.json.JSONModel({
                    data: {}
                });
                that.getView().setModel(oJSONModel, "JModel");

                that.getView().byId("Final_Update_Button").setEnabled(false);
                that.getView().byId("Final_DeleteEntireDocument_Button").setEnabled(false);

                that.getView().byId("Cash_Purchase_Document_H").setValue("");
                that.getView().byId("SAP_UUID_H").setValue("");
                that.getView().byId("Plant_H").setValue("");
                that.getView().byId("Vendor_H").setValue("");
                that.getView().byId("Partner_Doc_No_H").setValue("");
                that.getView().byId("No_Of_Packages_H").setValue("");
                that.getView().byId("Vehicle_No_H").setValue("");
                that.getView().byId("Person_Name_H").setValue("");

            },
            error: function(error) {
                console.error("Error updating header:", error);
                that._pBusyDialog.close();
                MessageToast.show(" "+Cash_Purchase_Document+" Not Updated Successfully")
            }
            });

        // }else{
        //     MessageBox.show("Please Fill the Mandatory Fields ", MessageBox.Icon.ERROR, "");
        //     this._pBusyDialog.close();
        // }

            // ---------- End Item Level

        },

        OnDeleteEntireDocument:function(){

            // ------- Loder Model Boc Open - Enable ----------------
            if (!this._pBusyDialog) {
                this._pBusyDialog = sap.ui.xmlfragment(this.getView().getId("BusyDialog"), "gatepass.view.fragments.BusyIndicator", this);
                this.getView().addDependent(this._pBusyDialog);
            }
            this._pBusyDialog.open();
            // ------- Loder Model Boc Open - Enable ----------------

            let Cash_Purchase_Document = this.getView().byId("Cash_Purchase_Document_H").getValue();
            let SAP_UUID_H = this.getView().byId("SAP_UUID_H").getValue();

            // ---------- Start Item Level

            var Table_Id = this.getView().byId("cashTable");
            var Table_Length = Table_Id.getRows().length;

            for (var i = 0; i < Table_Length; i++) {
            var oRow = Table_Id.getRows()[i];
            var oBindingContext = oRow.mAggregations;

            if (oBindingContext) {
                let Plant_I = oBindingContext.cells[1].mProperties.value;
                var SAP_UUID_I = oBindingContext.cells[11].mProperties.value;
                var Delete_Status01 = oRow.getCells()[0].getVisible();

                if (Plant_I !== "") {
                    var Delete_Status = "deleted";
                    
                var itemData = {
                    Status: Delete_Status
                };

                var oModel_04 = this.getView().getModel("YY1_CASH_PURCHASE_CDS");
                oModel_04.setHeaders({
                    "X-Requested-With": "X",
                    "Content-Type": "application/json"
                });

                oModel_04.update("/YY1_ITEM_CASH_PURCHASE(guid'" + SAP_UUID_I + "')", itemData, {
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

            var oModel05 = this.getView().getModel("YY1_CASH_PURCHASE_CDS");
            oModel05.setHeaders({
            "X-Requested-With": "X",
            "Content-Type": "application/json"
            });

            oModel05.update("/YY1_CASH_PURCHASE(guid'" + SAP_UUID_H + "')", oEntry1, {
            success: function(data) {
                console.log("Header Updated:", data);
                that._pBusyDialog.close();
                MessageToast.show(" "+Cash_Purchase_Document+" Deleted")        
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
                MessageToast.show(" "+Cash_Purchase_Document+" Not Deleted")
            }
            });

            // ---------- End Item Level

        },

        
        OnUnDeleteEntireDocument:function(){

            // ------- Loder Model Boc Open - Enable ----------------
            if (!this._pBusyDialog) {
                this._pBusyDialog = sap.ui.xmlfragment(this.getView().getId("BusyDialog"), "gatepass.view.fragments.BusyIndicator", this);
                this.getView().addDependent(this._pBusyDialog);
            }
            this._pBusyDialog.open();
            // ------- Loder Model Boc Open - Enable ----------------

            let Cash_Purchase_Document = this.getView().byId("Cash_Purchase_Document_H").getValue();
            let SAP_UUID_H = this.getView().byId("SAP_UUID_H").getValue();

            // ---------- Start Item Level

            var Table_Id = this.getView().byId("cashTable");
            var Table_Length = Table_Id.getRows().length;

            for (var i = 0; i < Table_Length; i++) {
            var oRow = Table_Id.getRows()[i];
            var oBindingContext = oRow.mAggregations;

            if (oBindingContext) {
                let Plant_I = oBindingContext.cells[1].mProperties.value;
                var SAP_UUID_I = oBindingContext.cells[11].mProperties.value;
                var Delete_Status01 = oRow.getCells()[0].getVisible();

                if (Plant_I !== "") {
                    var Delete_Status = "";
                    
                var itemData = {
                    Status: Delete_Status
                };

                var oModel_04 = this.getView().getModel("YY1_CASH_PURCHASE_CDS");
                oModel_04.setHeaders({
                    "X-Requested-With": "X",
                    "Content-Type": "application/json"
                });

                oModel_04.update("/YY1_ITEM_CASH_PURCHASE(guid'" + SAP_UUID_I + "')", itemData, {
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
                Status: "",
            };

            var that = this;

            var oModel05 = this.getView().getModel("YY1_CASH_PURCHASE_CDS");
            oModel05.setHeaders({
            "X-Requested-With": "X",
            "Content-Type": "application/json"
            });

            oModel05.update("/YY1_CASH_PURCHASE(guid'" + SAP_UUID_H + "')", oEntry1, {
            success: function(data) {
                console.log("Header Updated:", data);
                that._pBusyDialog.close();
                MessageToast.show(" "+Cash_Purchase_Document+" Retrived")        
                oModel05.refresh(true);
                that.getView().byId("DeleteIndicId").setVisible(false); 
                that.getView().byId("Final_Update_Button").setVisible(true); 
                that.getView().byId("Final_DeleteEntireDocument_Button").setVisible(true);
                that.getView().byId("Final_Cancel_Button").setVisible(true);
                that.getView().byId("UnFinal_DeleteEntireDocument_Button").setVisible(false);
            },
            error: function(error) {
                console.error("Error updating header:", error);
                that._pBusyDialog.close();
                MessageToast.show(" "+Cash_Purchase_Document+" Not Retrived")
            }
            });

        }
            

        });
    });
