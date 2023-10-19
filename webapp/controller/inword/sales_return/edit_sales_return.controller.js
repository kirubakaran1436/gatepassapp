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

        return Controller.extend("gatepass.controller.inword.sales_return.edit_sales_return", {
            onInit: function () {

            },
            
            OnBack:function(oEvent){
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			        oRouter.navTo("sales_return");
            },

            On_Bin_Select:function(oEvent){
                let Select_Key = oEvent.oSource.getSelectedItem().getKey();
                let Select_Value = oEvent.oSource.getSelectedItem().getText();

                if (Select_Value === "Yes"){
                    this.getView().byId("No_Of_Bins").setEnabled(true);
                }
                if(Select_Value === "No"){
                    this.getView().byId("No_Of_Bins").setEnabled(false);
                }
            },

            OnNoOfPackageEnter:function(){
                let NoOfPackage = this.getView().byId("No_Of_Package").getValue();
                let NoOfPackage01 = NoOfPackage.replace(/[^\d]+/g,'')
                    this.getView().byId("No_Of_Package").setValue(NoOfPackage01);
            },

            On_Bin_Enter:function(){
                let NoOfPackage = this.getView().byId("No_Of_Bins").getValue();
                let NoOfPackage01 = NoOfPackage.replace(/[^\d]+/g,'')
                    this.getView().byId("No_Of_Bins").setValue(NoOfPackage01);
            },

            // ----Start Select Items Table Delete
            OnTableRowRemove: function(oEvent) {
                var oTable = this.byId("SalesReturnTable");
                var oTableRows = oTable.getRows();
                var aIndices = this.byId("SalesReturnTable").getSelectedIndices();
                
                for (let i=0; i < oTableRows.length; i++){
                    console.log(i);
                    aIndices.forEach(function(Index){
                        var GetData = oTable.getRows()[Index].getCells()[1].getValue();
                        // console.log(GetData);
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
                // console.log(oTable.getRows()[]);

            },

            // ------------ General Purchase Document Select Fragment Open Start --------------------
        
        OnGenSalesDocNoFrag:function(oEvent){
            if (!this._dialog_GenPurDocNo) {
                this._dialog_GenPurDocNo = sap.ui.xmlfragment(this.getView().getId("GenSaleDocNo_dialog"), "gatepass.view.fragments.Sales_Return_Doc_No", this);
                this.getView().addDependent(this._dialog_GenPurDocNo);
            }
            this._dialog_GenPurDocNo.open();
        },

        OnGenSalesDocNoSearch: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter("Id", FilterOperator.Contains, sValue);
            var oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([oFilter]);
        },

        OnGenSaleDocNoSelect : function (oEvent) {

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
                let Dataa = this.getView().byId("Sales_Return_Document_H").getValue();
                if(Dataa === ""){
                    this.getView().byId("Final_Update_Button").setEnabled(false);
                    this.getView().byId("Final_Delete_Button").setEnabled(false);
                    this.getView().byId("Final_DeleteEntireDocument_Button").setEnabled(false);
                }
                
            }else{

                var GenPurDocNo, SAP_UUID_H;

                if (aContexts && aContexts.length) {
    
                    aContexts.map(function (oContext) {
                        GenPurDocNo = oContext.getObject().Id;
                        SAP_UUID_H = oContext.getObject().SAP_UUID;
                        return;
                    });
                    this.getView().byId("Sales_Return_Document_H").setValue(GenPurDocNo);
                    this.getView().byId("SAP_UUID_H").setValue(SAP_UUID_H);
                }
    
                var filter = new sap.ui.model.Filter("Id", sap.ui.model.FilterOperator.EQ, GenPurDocNo);
                var model0 = this.getOwnerComponent().getModel("YY1_SALES_RETURN_CDS");
                var that = this;
                model0.read("/YY1_SALES_RETURN", {
                    filters: [filter], 
                    success: function (ODat, oRespons) {
                        var value11 = ODat.results[0];  
                        var SAPUIID = value11.SAP_UUID;
                        var Status = value11.Status;

                        that.getView().byId("GatePass_Type_H").setValue(value11.Gate_Pass_Type);
                        that.getView().byId("Sales_Order_H").setValue(value11.Return_Sales_Order);
                        that.getView().byId("Plant_H").setValue(value11.Plant);
                        that.getView().byId("Customer_H").setValue(value11.Customer_Code);
                        that.getView().byId("Customer_Name_H").setValue(value11.Customer_Name);
                        that.getView().byId("No_Of_Package").setValue(value11.No_Of_Packages);
                        that.getView().byId("Vehicle_No_H").setValue(value11.Vehicle_No);
                        that.getView().byId("Bin_Select_H").setValue(value11.Bins);
                        if (value11.Bins === "Yes"){
                            that.getView().byId("No_Of_Bins").setEnabled(true);
                            that.getView().byId("No_Of_Bins").setValue(value11.No_Of_Bins);
                        }else{
                            that.getView().byId("No_Of_Bins").setEnabled(false);
                            that.getView().byId("No_Of_Bins").setValue(value11.No_Of_Bins); 
                        }

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
                        
                        that.getView().byId("Transporter").setValue(value11.Transporter);
                        that.getView().byId("Customer_Doc_No").setValue(value11.Customer_Doc_No);

                        model0.read("/YY1_SALES_RETURN(guid'" + SAPUIID + "')/to_Item", {
                            success: function (oData) {
                            var oJSONModel = new sap.ui.model.json.JSONModel({
                                data: oData.results
                            });
                            that.getView().setModel(oJSONModel, "JModel");
                            that._pBusyDialog.close();
                            that.getView().byId("Final_Update_Button").setEnabled(true);
                            that.getView().byId("Final_Delete_Button").setEnabled(true);
                            that.getView().byId("Final_DeleteEntireDocument_Button").setEnabled(true);
                            },
                            error: function (oError) {
                                console.log(oError);
                                that._pBusyDialog.close();
                                that.getView().byId("Final_Update_Button").setEnabled(false);
                                that.getView().byId("Final_Delete_Button").setEnabled(false);
                                that.getView().byId("Final_DeleteEntireDocument_Button").setEnabled(false);
                                }
                        });
                    }
    
                });
    

                console.log(aContexts)

            }
            // that._pBusyDialog.close();
            
        },

        // ------------ General Purchase Document Select Fragment Open End --------------------

        OnReceivedQty:function(value1, value2, value3, value4, value5, value6){
            var that = this; // Store reference to 'this'
                    var PoItem = value2;
                    var PoNo = value3;
                    var Vendor = value4;
                    var OrderQuantity = parseFloat(value5);
                    var GateToPostQty = parseFloat(value6);
                
                    return new Promise(function(resolve, reject) {
                        
                        var oFilter = new sap.ui.model.Filter("Sales_Order_Item", sap.ui.model.FilterOperator.EQ, PoItem);
                        var oFilter1 = new sap.ui.model.Filter("Sales_Order", sap.ui.model.FilterOperator.EQ, PoNo);
                        var oFilter2 = new sap.ui.model.Filter("Customer_Code", sap.ui.model.FilterOperator.EQ, Vendor);
                        var oFilter3 = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, '');
                
                        var oModel = that.getView().getModel("YY1_SALES_RETURN_CDS");
                        var oFilters = [oFilter, oFilter1, oFilter2, oFilter3];

                        var CalData = 0;
                
                        oModel.read("/YY1_ITEM_SALES_RETURN", {
                            filters: oFilters,
                            success: function(oData) {
                                var aItems = oData.results;
                                for (var i = 0; i < aItems.length; i++) {
                                    CalData += parseFloat(aItems[i].Gate_Quantity_To_Post);
                                }
                                resolve(CalData); // Resolve with the data
                            },
                            error: function(oError) {
                                console.error("Error reading data: ", oError);
                                reject(oError); // Reject with the error
                            }
                        });
                    }); 
        },

        OnPendingQty:function(value1, value2, value3, value4, value5, value6){
                        var that = this;
                        var PoItem = value2;
                        var PoNo = value3;
                        var Vendor = value4;
                        var OrderQuantity = parseFloat(value5);
                        var GateToPostQty = parseFloat(value6);
                
                    return new Promise(function(resolve, reject) {                        
                
                        var oFilter = new sap.ui.model.Filter("Sales_Order_Item", sap.ui.model.FilterOperator.EQ, PoItem);
                        var oFilter1 = new sap.ui.model.Filter("Sales_Order", sap.ui.model.FilterOperator.EQ, PoNo);
                        var oFilter2 = new sap.ui.model.Filter("Customer_Code", sap.ui.model.FilterOperator.EQ, Vendor);
                        var oFilter3 = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, '');
                
                        var oModel01 = that.getView().getModel("YY1_SALES_RETURN_CDS");
                        var oFilters = [oFilter, oFilter1, oFilter2, oFilter3];

                        var CalData = 0;
                
                        oModel01.read("/YY1_ITEM_SALES_RETURN", {
                            filters: oFilters,
                            success: function(oData) {
                                var aItems = oData.results;
                                for (var i = 0; i < aItems.length; i++) {
                                    CalData += parseFloat(aItems[i].Gate_Quantity_To_Post);
                                }
                                // console.log("---------------------------------------------");
                                // console.log(OrderQuantity);
                                // console.log(CalData);
                                var FinalData = parseFloat(OrderQuantity) - parseFloat(CalData);
                                // console.log(FinalData);
                                // console.log("---------------------------------------------");
                                resolve(FinalData); // Resolve with the data
                            },
                            error: function(oError) {
                                console.error("Error reading data: ", oError);
                                reject(oError); // Reject with the error
                            }
                        });
                    }); 
            },

            OnGatePostEntryED:function(value1, value2, value3, value4, value5, value6, value7){
                        var that = this;
                        var PoItem = value2;
                        var PoNo = value3;
                        var Vendor = value4;
                        var OrderQuantity = parseFloat(value5);
                        var GateToPostQty = parseFloat(value6);
                        var DeleteStatus = value7;
                
                    return new Promise(function(resolve, reject) {  
                        
                        if(DeleteStatus === "deleted"){

                            resolve(false);

                        }else{
                            var oFilter = new sap.ui.model.Filter("Sales_Order_Item", sap.ui.model.FilterOperator.EQ, PoItem);
                        var oFilter1 = new sap.ui.model.Filter("Sales_Order", sap.ui.model.FilterOperator.EQ, PoNo);
                        var oFilter2 = new sap.ui.model.Filter("Customer_Code", sap.ui.model.FilterOperator.EQ, Vendor);
                        var oFilter3 = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, '');
                
                        var oModel02 = that.getView().getModel("YY1_SALES_RETURN_CDS");
                        var oFilters = [oFilter, oFilter1, oFilter2, oFilter3];

                        var CalData = 0;
                
                        oModel02.read("/YY1_ITEM_SALES_RETURN", {
                                filters: oFilters,
                                success: function(oData) {
                                    var aItems = oData.results;
                                    for (var i = 0; i < aItems.length; i++) {
                                        console.log(aItems[i].Status)
                                        CalData += parseFloat(aItems[i].Gate_Quantity_To_Post);
                                    }
                                    // console.log("---------------------------------------------");
                                    // console.log(OrderQuantity);
                                    // console.log(CalData);
                                    var FinalData = parseFloat(OrderQuantity) - parseFloat(CalData);
                                    // console.log(FinalData);
                                    // console.log("---------------------------------------------");
    
                                    if(FinalData === 0 && GateToPostQty === 0){
                                        var Status = false;
                                    }else{
                                        var Status = true;
                                    }
    
                                    // console.log(Status);
    
                                    
                                    resolve(Status); // Resolve with the data
                                },
                                error: function(oError) {
                                    console.error("Error reading data: ", oError);
                                    reject(oError); // Reject with the error
                                }
                            });
                        }
                
                        
                    }); 
            },

            OnGateQtyToPostEnter:function(oEvent){
                    let Quantity_to_Post_Input = oEvent.getSource().getParent().getCells()[7].getValue(); 
                    let GatePendingQty = oEvent.getSource().getParent().getCells()[6].getValue(); 
                    let OrderQuantity = oEvent.getSource().getParent().getCells()[3].getValue(); 
                    
                    if (Quantity_to_Post_Input === ""){
                        oEvent.getSource().getParent().getCells()[7].setValue("0"); 
                    }else{
                    let PoItem = oEvent.getSource().getParent().getCells()[1].getValue(); 
                    let PoNo = oEvent.getSource().getParent().getCells()[2].getValue(); 
                    let Id = this.getView().byId("Sales_Return_Document_H").getValue();
                    let Customer_Code = this.getView().byId("Customer_H").getValue();

                    let Quantity_to_Post_Input_Float = parseFloat(Quantity_to_Post_Input);
                    let OrderQuantity_Float = parseFloat(OrderQuantity);

                    var oFilter = new sap.ui.model.Filter("Sales_Order_Item", sap.ui.model.FilterOperator.EQ, PoItem);
                    var oFilter1 = new sap.ui.model.Filter("Sales_Order", sap.ui.model.FilterOperator.EQ, PoNo);
                    var oFilter2 = new sap.ui.model.Filter("Customer_Code", sap.ui.model.FilterOperator.EQ, Customer_Code);
                    var oFilter3 = new sap.ui.model.Filter("Id", sap.ui.model.FilterOperator.EQ, Id);
                
                        var oModel002 = this.getView().getModel("YY1_SALES_RETURN_CDS");
                        var oModel03 = this.getView().getModel("YY1_SALES_RETURN_CDS");
                        var oFilters = [oFilter, oFilter1, oFilter2, oFilter3];
                
                        oModel002.read("/YY1_ITEM_SALES_RETURN", {
                            filters: oFilters,
                            success: function(oData) {
                                var aItems01 = oData.results;
                                
                                console.log(aItems01[0].Gate_Quantity_To_Post); 

                                var Clone_Quantity_to_Post_Input_Float = parseFloat(aItems01[0].Gate_Quantity_To_Post);

                                // -----------------------------------
                        var oFilter00 = new sap.ui.model.Filter("Sales_Order_Item", sap.ui.model.FilterOperator.EQ, PoItem);
                        var oFilter100 = new sap.ui.model.Filter("Sales_Order", sap.ui.model.FilterOperator.EQ, PoNo);
                        var oFilter200 = new sap.ui.model.Filter("Customer_Code", sap.ui.model.FilterOperator.EQ, Customer_Code);
                
                        
                        var oFilters = [oFilter, oFilter1, oFilter2];

                        var CalData = 0;
                
                        oModel03.read("/YY1_ITEM_SALES_RETURN", {
                            filters: oFilters,
                            success: function(oData) {
                                var aItems = oData.results;
                                for (var i = 0; i < aItems.length; i++) {
                                    CalData += parseFloat(aItems[i].Gate_Quantity_To_Post);
                                }
                                console.log("---------------------------------------------");
                                var GatePendingQty = parseFloat(OrderQuantity_Float) - parseFloat(CalData);
                                // console.log(GatePendingQty);
                                var GatePendingQty_Float = GatePendingQty + Clone_Quantity_to_Post_Input_Float;

                                console.log("---------------------------------------------");

                                // -==================================================
                                if (parseFloat(Quantity_to_Post_Input_Float) > parseFloat(GatePendingQty_Float)){
                                    oEvent.getSource().getParent().getCells()[7].setValue(Clone_Quantity_to_Post_Input_Float);
                                    oEvent.getSource().getParent().getCells()[7].setValueState(sap.ui.core.ValueState.Error);
                                    console.log("If Condition 01");
                                }else{
                                    oEvent.getSource().getParent().getCells()[7].setValueState(sap.ui.core.ValueState.None);
                                    console.log("If COndition 03")
                                }
                                // -==================================================

                            },
                            error: function(oError) {
                                console.error("Error reading data: ", oError);
                                reject(oError); // Reject with the error
                            }
                        });
                                // -----------------------------------

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

                let Id = this.getView().byId("Sales_Return_Document_H").getValue();
                let SAP_UUID_H = this.getView().byId("SAP_UUID_H").getValue();
                let Gate_Pass_Type = this.getView().byId("GatePass_Type_H").getValue();
                let Plant = this.getView().byId("Plant_H").getValue();
                let Return_Sales_Order = this.getView().byId("Sales_Order_H").getValue();
                let Customer_Code = this.getView().byId("Customer_H").getValue();
                let Customer_Name = this.getView().byId("Customer_Name_H").getValue();
                let No_Of_Packages = this.getView().byId("No_Of_Package").getValue();
                let Vehicle_No = this.getView().byId("Vehicle_No_H").getValue();
                let Bins = this.getView().byId("Bin_Select_H").getValue();
                let No_Of_Bins = this.getView().byId("No_Of_Bins").getValue();
                let Transporter = this.getView().byId("Transporter").getValue();
                let Customer_Doc_No = this.getView().byId("Customer_Doc_No").getValue();

                console.log(Id);
                console.log(SAP_UUID_H);
                console.log(Gate_Pass_Type);
                console.log(Plant);
                console.log(Return_Sales_Order);
                console.log(Customer_Code);
                console.log(Customer_Name);
                console.log(No_Of_Packages);
                console.log(Vehicle_No);
                console.log(Bins);
                console.log(No_Of_Bins);
                console.log(Transporter);
                console.log(Customer_Doc_No);


                // ---------- Start Item Level

                var Table_Id = this.getView().byId("SalesReturnTable");
                var Table_Length = Table_Id.getRows().length;

                for (var i = 0; i < Table_Length; i++) {
                var oRow = Table_Id.getRows()[i];
                var oBindingContext = oRow.mAggregations;

                if (oBindingContext) {
                    var Gate_Quantity_To_Post = oBindingContext.cells[7].mProperties.value;
                    var SAP_UUID_I = oBindingContext.cells[14].mProperties.value;
                    var Delete_Status01 = oRow.getCells()[0].getVisible();

                    if (Gate_Quantity_To_Post !== "") {
                        if(Delete_Status01 === true){
                            var Delete_Status = "deleted";
                        }
                        if (Delete_Status01 === false){
                            var Delete_Status = "";
                        }
                    var itemData = {
                        Gate_Quantity_To_Post: Gate_Quantity_To_Post,
                        Status: Delete_Status
                    };

                    var oModel_04 = this.getView().getModel("YY1_SALES_RETURN_CDS");
                    oModel_04.setHeaders({
                        "X-Requested-With": "X",
                        "Content-Type": "application/json"
                    });

                    oModel_04.update("/YY1_ITEM_SALES_RETURN(guid'" + SAP_UUID_I + "')", itemData, {
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
                    No_Of_Packages: No_Of_Packages,
                    Vehicle_No:Vehicle_No,
                    Bins:Bins,
                    No_Of_Bins:No_Of_Bins,
                    Transporter:Transporter,
                    Customer_Doc_No:Customer_Doc_No
                };

                var that = this;

                var oModel05 = this.getView().getModel("YY1_SALES_RETURN_CDS");
                oModel05.setHeaders({
                "X-Requested-With": "X",
                "Content-Type": "application/json"
                });

                oModel05.update("/YY1_SALES_RETURN(guid'" + SAP_UUID_H + "')", oEntry1, {
                success: function(data) {
                    console.log("Header Updated:", data);
                    that._pBusyDialog.close();
                    oModel05.refresh(true);
                    MessageBox.success("Document No " + Id + " Updated Successfully", {
                        title: "Change Sales Return",
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
                    
                    that.getView().byId("Sales_Return_Document_H").setValue("");
                    that.getView().byId("SAP_UUID_H").setValue("");
                    that.getView().byId("GatePass_Type_H").setValue("");
                    that.getView().byId("Plant_H").setValue("");
                    that.getView().byId("Sales_Order_H").setValue("");
                    that.getView().byId("Customer_H").setValue("");
                    that.getView().byId("Customer_Name_H").setValue("");
                    that.getView().byId("No_Of_Package").setValue("");
                    that.getView().byId("Vehicle_No_H").setValue("");
                    that.getView().byId("Bin_Select_H").setValue("");
                    that.getView().byId("No_Of_Bins").setValue("");
                    that.getView().byId("Transporter").setValue("");
                    that.getView().byId("Customer_Doc_No").setValue("");
                },
                error: function(error) {
                    console.error("Error updating header:", error);
                    that._pBusyDialog.close();
                    MessageToast.show(" "+Id+" Not Updated Successfully")
                }
                });

                // ---------- End Item Level

               


            },

            
            OnDeleteEntireDocument:function(){

                if (!this._pBusyDialog) {
                    this._pBusyDialog = sap.ui.xmlfragment(this.getView().getId("BusyDialog"), "gatepass.view.fragments.BusyIndicator", this);
                    this.getView().addDependent(this._pBusyDialog);
                }
                this._pBusyDialog.open();
                // ------- Loder Model Boc Open - Enable ----------------

                let Sales_Return_Document = this.getView().byId("Sales_Return_Document_H").getValue();
                let SAP_UUID_H = this.getView().byId("SAP_UUID_H").getValue();

                // ---------- Start Item Level

                var Table_Id = this.getView().byId("SalesReturnTable");
                var Table_Length = Table_Id.getRows().length;

                for (var i = 0; i < Table_Length; i++) {
                var oRow = Table_Id.getRows()[i];
                var oBindingContext = oRow.mAggregations;

                if (oBindingContext) {
                    var Gate_Quantity_To_Post = oBindingContext.cells[7].mProperties.value;
                    var SAP_UUID_I = oBindingContext.cells[14].mProperties.value;
                    var Delete_Status01 = oRow.getCells()[0].getVisible();

                    if (Gate_Quantity_To_Post !== "") {
                        var Delete_Status = "deleted";
                        
                    var itemData = {
                        Status: Delete_Status
                    };

                    var oModel_04 = this.getView().getModel("YY1_SALES_RETURN_CDS");
                    oModel_04.setHeaders({
                        "X-Requested-With": "X",
                        "Content-Type": "application/json"
                    });

                    oModel_04.update("/YY1_ITEM_SALES_RETURN(guid'" + SAP_UUID_I + "')", itemData, {
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

                var oModel05 = this.getView().getModel("YY1_SALES_RETURN_CDS");
                oModel05.setHeaders({
                "X-Requested-With": "X",
                "Content-Type": "application/json"
                });

                oModel05.update("/YY1_SALES_RETURN(guid'" + SAP_UUID_H + "')", oEntry1, {
                success: function(data) {
                    console.log("Header Updated:", data);
                    that._pBusyDialog.close();
                    MessageToast.show(" "+Sales_Return_Document+" Deleted")        
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
                    MessageToast.show(" "+Sales_Return_Document+" Not Deleted")
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

                let Sales_Return_Document = this.getView().byId("Sales_Return_Document_H").getValue();
                let SAP_UUID_H = this.getView().byId("SAP_UUID_H").getValue();

                // ---------- Start Item Level

                var Table_Id = this.getView().byId("SalesReturnTable");
                var Table_Length = Table_Id.getRows().length;

                for (var i = 0; i < Table_Length; i++) {
                var oRow = Table_Id.getRows()[i];
                var oBindingContext = oRow.mAggregations;

                if (oBindingContext) {
                    var Gate_Quantity_To_Post = oBindingContext.cells[7].mProperties.value;
                    var SAP_UUID_I = oBindingContext.cells[14].mProperties.value;
                    var Delete_Status01 = oRow.getCells()[0].getVisible();

                    if (Gate_Quantity_To_Post !== "") {
                        var Delete_Status = "";
                        
                    var itemData = {
                        Status: Delete_Status
                    };

                    var oModel_04 = this.getView().getModel("YY1_SALES_RETURN_CDS");
                    oModel_04.setHeaders({
                        "X-Requested-With": "X",
                        "Content-Type": "application/json"
                    });

                    oModel_04.update("/YY1_ITEM_SALES_RETURN(guid'" + SAP_UUID_I + "')", itemData, {
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

                var oModel05 = this.getView().getModel("YY1_SALES_RETURN_CDS");
                oModel05.setHeaders({
                "X-Requested-With": "X",
                "Content-Type": "application/json"
                });

                oModel05.update("/YY1_SALES_RETURN(guid'" + SAP_UUID_H + "')", oEntry1, {
                success: function(data) {
                    console.log("Header Updated:", data);
                    that._pBusyDialog.close();
                    MessageToast.show(" "+Sales_Return_Document+" Retrived")        
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
                    MessageToast.show(" "+Sales_Return_Document+" Not Retrived")
                }
                });

                // ---------- End Item Level

                


            }

        });
    });
