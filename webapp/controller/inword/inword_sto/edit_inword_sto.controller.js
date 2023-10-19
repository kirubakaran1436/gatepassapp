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

        return Controller.extend("gatepass.controller.inword.inword_sto.edit_inword_sto", {
            onInit: function () {

            },
            
            OnBack:function(oEvent){
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			        oRouter.navTo("inword_sto");
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
                let NoOfPackage01 = NoOfPackage.replace(/[^\d]+/g,'') // allow the digits
                    this.getView().byId("No_Of_Package").setValue(NoOfPackage01);
            },

            On_Bin_Enter:function(){
                let NoOfPackage = this.getView().byId("No_Of_Bins").getValue();
                let NoOfPackage01 = NoOfPackage.replace(/[^\d]+/g,'')
                    this.getView().byId("No_Of_Bins").setValue(NoOfPackage01);
            },

            // ----Start Select Items Table Delete
            OnTableRowRemove: function(oEvent) {
                var oTable = this.byId("salessto");
                var oTableRows = oTable.getRows();
                var aIndices = this.byId("salessto").getSelectedIndices();
                
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

            // ------------ on Sales STO Select Fragment Open Start --------------------
        
            OnSalesSTODocNoFrag:function(oEvent){
            if (!this._dialog_SalesSTODocNo) {
                this._dialog_SalesSTODocNo = sap.ui.xmlfragment(this.getView().getId("InwordSTODocNo_dialog"), "gatepass.view.fragments.Inword_STO_Doc_No", this);
                this.getView().addDependent(this._dialog_SalesSTODocNo);
            }
            this._dialog_SalesSTODocNo.open();
        },

        OnInwardSTODocNoSearch: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter("Id", FilterOperator.Contains, sValue);
            var oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([oFilter]);
        },

        OnInwardSTODocNoSelect : function (oEvent) {

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
                let Dataa = this.getView().byId("Inbound_Delivery_No_H").getValue();
                if(Dataa === ""){
                    this.getView().byId("Final_Update_Button").setEnabled(false);
                    this.getView().byId("Final_Delete_Button").setEnabled(false);
                    this.getView().byId("Final_DeleteEntireDocument_Button").setEnabled(false);
                }
                
            }else{

                var GenPurDocNo, SAP_UUID_H,GatePasstype;

                if (aContexts && aContexts.length) {
    
                    aContexts.map(function (oContext) {
                        GenPurDocNo = oContext.getObject().Id;
                        SAP_UUID_H = oContext.getObject().SAP_UUID;
                        GatePasstype = oContext.getObject().Gate_Entry_Type;
                        return;
                    });
                    this.getView().byId("Inbound_Delivery_No_H").setValue(GenPurDocNo);
                    this.getView().byId("SAP_UUID_H").setValue(SAP_UUID_H);
                    this.getView().byId("GatePass_Type_H").setValue(GatePasstype);
                }
    
                var filter = new sap.ui.model.Filter("Id", sap.ui.model.FilterOperator.EQ, GenPurDocNo);
                var model0 = this.getOwnerComponent().getModel("YY1_INWORD_STO_CDS");
                var that = this;
                model0.read("/YY1_INWORD_STO", {
                    filters: [filter], 
                    success: function (ODat, oRespons) {
                        var value11 = ODat.results[0];  
                        var SAPUIID = value11.SAP_UUID;
                        var Status = value11.Status;

                        that.getView().byId("GatePass_Type_H").setValue(value11.Gate_Entry_Type);
                        that.getView().byId("Ship_To_Party_H").setValue(value11.Customer_Code);
                        that.getView().byId("Ship_To_Party_Name_H").setValue(value11.Customer_Name);
                        that.getView().byId("idpack_sto").setValue(value11.No_Of_Packages);
                        that.getView().byId("idvech_sto").setValue(value11.Vehicle_No);
                        that.getView().byId("Bin_Select_H_sto").setValue(value11.Bins);
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
                            that.getView().byId("UnFinal_DeleteEntireDocument_Button").setVisible(true); 
                        }else{
                            that.getView().byId("DeleteIndicId").setVisible(false); 
                            that.getView().byId("Final_Update_Button").setVisible(true); 
                            that.getView().byId("Final_DeleteEntireDocument_Button").setVisible(true);
                            that.getView().byId("UnFinal_DeleteEntireDocument_Button").setVisible(false);
                        }
                        
                        that.getView().byId("idtrans_sto").setValue(value11.Transporter);

                        model0.read("/YY1_INWORD_STO(guid'" + SAPUIID + "')/to_ITEMS", {
                            success: function (oData) {
                            var oJSONModel = new sap.ui.model.json.JSONModel({
                                data: oData.results
                            });
                           console.log(oJSONModel);

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


        OnCustomerNameFetch:function(oEvent){
            let Dataa = this.getView().byId("Ship_To_Party_H").getValue();
            var data = new Promise(function (resolve) {

                let Dataa1 = Dataa;
                
                resolve(Dataa1);
                });
            return data;
        },


        OnCustomerFetch:function(oEvent){
            let Dataa = this.getView().byId("Ship_To_Party_Name_H").getValue();
            var data = new Promise(function (resolve) {

                let Dataa1 = Dataa;
                
                resolve(Dataa1);
                });
            return data;
        },

        // ------------ Sales STO Document Select Fragment Open End --------------------

        OnReceivedQty:function(value1, value2,value3,value5){
            var that = this; // Store reference to 'this'
                    var PoItem = value1;
                    var PoNo = value2;
                    var OrderQuantity = parseFloat(value3);
                    var GateToPostQty = parseFloat(value5);
                
                    return new Promise(function(resolve, reject) {
                        
                        var oFilter = new sap.ui.model.Filter("Return_Order_Item", sap.ui.model.FilterOperator.EQ, PoItem);
                        var oFilter1 = new sap.ui.model.Filter("Return_Order", sap.ui.model.FilterOperator.EQ, PoNo);
                        var oFilter2 = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, '');
                
                        var oModel = that.getView().getModel("YY1_INWORD_STO_CDS");
                        var oFilters = [oFilter, oFilter1, oFilter2];

                        var CalData = 0;
                
                        oModel.read("/YY1_ITEMS_INWORD_STO", {
                            filters: oFilters,
                            success: function(oData) {
                                var aItems = oData.results;
                                for (var i = 0; i < aItems.length; i++) {
                                    CalData += parseFloat(aItems[i].Quantity_To_Post);
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

        OnPendingQty:function(value1,value2,value3,value4,value5){
                        var that = this;
                        var PoItem = value1;
                        var PoNo = value2;
                        var OrderQuantity = parseFloat(value3);
                        var GateToPostQty = parseFloat(value5);
                
                    return new Promise(function(resolve, reject) {                        
                
                        var oFilter = new sap.ui.model.Filter("Return_Order_Item", sap.ui.model.FilterOperator.EQ, PoItem);
                        var oFilter1 = new sap.ui.model.Filter("Return_Order", sap.ui.model.FilterOperator.EQ, PoNo);
                        var oFilter2 = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, '');
                
                        var oModel01 = that.getView().getModel("YY1_INWORD_STO_CDS");
                        var oFilters = [oFilter, oFilter1, oFilter2];

                        var CalData = 0;
                
                        oModel01.read("/YY1_ITEMS_INWORD_STO", {
                            filters: oFilters,
                            success: function(oData) {
                                var aItems = oData.results;
                                for (var i = 0; i < aItems.length; i++) {
                                    CalData += parseFloat(aItems[i].Quantity_To_Post);
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



            OnGatePostEntryED:function(value1, value2,value3,value5,value7){
                        var that = this;
                        var PoItem = value1;
                        var PoNo = value2;
                        var OrderQuantity = parseFloat(value3);
                        var GateToPostQty = parseFloat(value5);
                        var DeleteStatus = value7;
                
                    return new Promise(function(resolve, reject) {  
                        
                        if(DeleteStatus === "deleted"){

                            resolve(false);

                        }else{

                        var oFilter = new sap.ui.model.Filter("Return_Order_Item", sap.ui.model.FilterOperator.EQ, PoItem);
                        var oFilter1 = new sap.ui.model.Filter("Return_Order", sap.ui.model.FilterOperator.EQ, PoNo);
                        var oFilter2= new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, '');
                
                        var oModel02 = that.getView().getModel("YY1_INWORD_STO_CDS");
                        var oFilters = [oFilter, oFilter1, oFilter2];

                        var CalData = 0;
                
                        oModel02.read("/YY1_ITEMS_INWORD_STO", {
                                filters: oFilters,
                                success: function(oData) {
                                    var aItems = oData.results;
                                    for (var i = 0; i < aItems.length; i++) {
                                        console.log(aItems[i].Status)
                                        CalData += parseFloat(aItems[i].Quantity_To_Post);
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





// -------------------------

            OnGateQtyToPostEnter:function(oEvent){
                let Quantity_to_Post_Input = oEvent.getSource().getParent().getCells()[6].getValue(); 
                let GatePendingQty = oEvent.getSource().getParent().getCells()[5].getValue(); 
                let OrderQuantity = oEvent.getSource().getParent().getCells()[3].getValue(); 
                
                if (Quantity_to_Post_Input === ""){
                    oEvent.getSource().getParent().getCells()[6].setValue("0"); 
                    this.getView().byId("Final_Update_Button").setEnabled(true);
                }else{

                    this.getView().byId("Final_Update_Button").setEnabled(false);

                let PoItem = oEvent.getSource().getParent().getCells()[1].getValue(); 
                let PoNo = oEvent.getSource().getParent().getCells()[2].getValue();  
                let Id = this.getView().byId("Inbound_Delivery_No_H").getValue();

                let Quantity_to_Post_Input_Float = parseFloat(Quantity_to_Post_Input);
                let OrderQuantity_Float = parseFloat(OrderQuantity);

                var oFilter = new sap.ui.model.Filter("Return_Order_Item", sap.ui.model.FilterOperator.EQ, PoItem);
                var oFilter1 = new sap.ui.model.Filter("Return_Order", sap.ui.model.FilterOperator.EQ, PoNo);
                var oFilter2 = new sap.ui.model.Filter("Id", sap.ui.model.FilterOperator.EQ, Id);
            
                    var oModel02 = this.getView().getModel("YY1_INWORD_STO_CDS");
                    var oModel03 = this.getView().getModel("YY1_INWORD_STO_CDS");
                    var oFilters = [oFilter, oFilter1, oFilter2];
            

                    var that = this;
                    oModel02.read("/YY1_ITEMS_INWORD_STO", {
                        filters: oFilters,
                        success: function(oData) {
                            var aItems01 = oData.results;
                            
                            console.log(aItems01[0].Quantity_To_Post); 

                            var Clone_Quantity_to_Post_Input_Float = parseFloat(aItems01[0].Quantity_To_Post);

                            // -----------------------------------            
                    
                    var oFilters = [oFilter, oFilter1];

                    var CalData = 0;
            
                    oModel03.read("/YY1_ITEMS_INWORD_STO", {
                        filters: oFilters,
                        success: function(oData) {
                            var aItems = oData.results;
                            for (var i = 0; i < aItems.length; i++) {
                                CalData += parseFloat(aItems[i].Quantity_To_Post);
                            }
                            console.log("---------------------------------------------");
                            var GatePendingQty = parseFloat(OrderQuantity_Float) - parseFloat(CalData);
                            // console.log(GatePendingQty);
                            var GatePendingQty_Float = GatePendingQty + Clone_Quantity_to_Post_Input_Float;

                            console.log("---------------------------------------------");

                            // -==================================================
                            if (parseFloat(Quantity_to_Post_Input_Float) > parseFloat(GatePendingQty_Float)){
                                oEvent.getSource().getParent().getCells()[6].setValue(Clone_Quantity_to_Post_Input_Float);
                                // oEvent.getSource().getParent().getCells()[7].setValueState(sap.ui.core.ValueState.Error);
                                that.getView().byId("Final_Update_Button").setEnabled(true);
                                
                                console.log("If Condition 01");

                            }else{
                                oEvent.getSource().getParent().getCells()[6].setValueState(sap.ui.core.ValueState.None);
                                console.log("If COndition 03")
                                that.getView().byId("Final_Update_Button").setEnabled(true);
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
                let Inbound_Delivery_No = this.getView().byId("Inbound_Delivery_No_H").getValue();
                let Gate_Entry_Type = this.getView().byId("GatePass_Type_H").getValue();
                let SAP_UUID_H = this.getView().byId("SAP_UUID_H").getValue();
                let Ship_To_Party_H = this.getView().byId("Ship_To_Party_H").getValue();
                let Ship_To_Party_Name_H = this.getView().byId("Ship_To_Party_Name_H").getValue();
                let idpack_sto = this.getView().byId("idpack_sto").getValue();
                let idvech_sto = this.getView().byId("idvech_sto").getValue();
                let Bin_Select_H_sto = this.getView().byId("Bin_Select_H_sto").getValue();
                let No_Of_Bins = this.getView().byId("No_Of_Bins").getValue();

                console.log(Inbound_Delivery_No);
                console.log(Gate_Entry_Type);
                console.log(SAP_UUID_H);
                console.log(Ship_To_Party_H);
                console.log(Ship_To_Party_Name_H);
                console.log(idpack_sto);
                console.log(idvech_sto);
                console.log(Bin_Select_H_sto);
                console.log(No_Of_Bins);

    

                // ---------- End Item Level
                if (Inbound_Delivery_No !== "" ){

                    var Table_Id = this.getView().byId("salessto");
                var Table_Length = Table_Id.getRows().length;

                for (var i = 0; i < Table_Length; i++) {
                var oRow = Table_Id.getRows()[i];
                var oBindingContext = oRow.mAggregations;

                if (oBindingContext) {
                    var Gate_Quantity_To_Post = oBindingContext.cells[6].mProperties.value;
                    var SAP_UUID_I = oBindingContext.cells[15].mProperties.value;
                    var Delete_Status01 = oRow.getCells()[0].getVisible();

                    if (Gate_Quantity_To_Post !== "") {
                        if(Delete_Status01 === true){
                            var Delete_Status = "deleted";
                        }
                        if (Delete_Status01 === false){
                            var Delete_Status = "";
                        }
                    var itemData = {
                        Quantity_To_Post: Gate_Quantity_To_Post,
                        Status: Delete_Status
                    };

                    var oModel_04 = this.getView().getModel("YY1_INWORD_STO_CDS");
                    oModel_04.setHeaders({
                        "X-Requested-With": "X",
                        "Content-Type": "application/json"
                    });

                    oModel_04.update("/YY1_ITEMS_INWORD_STO(guid'" + SAP_UUID_I + "')", itemData, {
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
                    
                    Gate_Entry_Type:Gate_Entry_Type,
                    // Ship_To_Party_H:Ship_To_Party_H,
                    // Ship_To_Party_Name_H:Ship_To_Party_Name_H,
                    // No_Of_Bins:No_Of_Bins,
                    // Bin_Select_H_sto:Bin_Select_H_sto,
                };

                var that = this;

                var oModel05 = this.getView().getModel("YY1_INWORD_STO_CDS");
                oModel05.setHeaders({
                "X-Requested-With": "X",
                "Content-Type": "application/json"
                });

                oModel05.update("/YY1_INWORD_STO(guid'" + SAP_UUID_H + "')", oEntry1, {
                success: function(data) {
                    console.log("Header Updated:", data);
                    that._pBusyDialog.close();
                    oModel05.refresh(true);
                    MessageBox.success("Document No " + Inbound_Delivery_No + " Updated Successfully", {
                        title: "Change STO Goods Receipt",
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

                    that.getView().byId("Inbound_Delivery_No_H").setValue("");
                    that.getView().byId("GatePass_Type_H").setValue("");
                    that.getView().byId("SAP_UUID_H").setValue("");
                    that.getView().byId("Ship_To_Party_H").setValue("");
                    that.getView().byId("Ship_To_Party_Name_H").setValue("");
                    that.getView().byId("idpack_sto").setValue("");
                    that.getView().byId("idvech_sto").setValue("");
                    that.getView().byId("Bin_Select_H_sto").setValue("");
                    that.getView().byId("No_Of_Bins").setValue("");

                },
                error: function(error) {
                    console.error("Error updating header:", error);
                    that._pBusyDialog.close();
                    MessageToast.show(" "+Inbound_Delivery_No+" Not Updated Successfully")
                }
                });

                // ---------- End Item Level

                }
                
            


            },

            
            OnDeleteEntireDocument:function(){

                // ------- Loder Model Boc Open - Enable ----------------
                if (!this._pBusyDialog) {
                    this._pBusyDialog = sap.ui.xmlfragment(this.getView().getId("BusyDialog"), "gatepass.view.fragments.BusyIndicator", this);
                    this.getView().addDependent(this._pBusyDialog);
                }
                this._pBusyDialog.open();
                // ------- Loder Model Boc Open - Enable ----------------

                let Inbound_Delivery_No = this.getView().byId("Inbound_Delivery_No_H").getValue();
                let SAP_UUID_H = this.getView().byId("SAP_UUID_H").getValue();

                // ---------- Start Item Level

                var Table_Id = this.getView().byId("salessto");
                var Table_Length = Table_Id.getRows().length;

                for (var i = 0; i < Table_Length; i++) {
                var oRow = Table_Id.getRows()[i];
                var oBindingContext = oRow.mAggregations;

                if (oBindingContext) {
                    var Gate_Quantity_To_Post = oBindingContext.cells[6].mProperties.value;
                    var SAP_UUID_I = oBindingContext.cells[15].mProperties.value;
                    var Delete_Status01 = oRow.getCells()[0].getVisible();

                    if (Gate_Quantity_To_Post !== "") {
                        var Delete_Status = "deleted";
                        
                    var itemData = {
                        Status: Delete_Status
                    };

                    var oModel_04 = this.getView().getModel("YY1_SALES_STO_CDS");
                    oModel_04.setHeaders({
                        "X-Requested-With": "X",
                        "Content-Type": "application/json"
                    });

                    oModel_04.update("/YY1_ITEM_SALES_STO(guid'" + SAP_UUID_I + "')", itemData, {
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

                var oModel05 = this.getView().getModel("YY1_SALES_STO_CDS");
                oModel05.setHeaders({
                "X-Requested-With": "X",
                "Content-Type": "application/json"
                });

                oModel05.update("/YY1_SALES_STO(guid'" + SAP_UUID_H + "')", oEntry1, {
                success: function(data) {
                    console.log("Header Updated:", data);
                    that._pBusyDialog.close();
                    MessageToast.show(" "+Inbound_Delivery_No+" Deleted Successfully")        
                    oModel05.refresh(true);
                    that.getView().byId("DeleteIndicId").setVisible(true); 
                    that.getView().byId("Final_Update_Button").setVisible(false); 
                    that.getView().byId("Final_DeleteEntireDocument_Button").setVisible(false); 
                    that.getView().byId("UnFinal_DeleteEntireDocument_Button").setVisible(true); 
                },
                error: function(error) {
                    console.error("Error updating header:", error);
                    that._pBusyDialog.close();
                    MessageToast.show(" "+Inbound_Delivery_No+" Not Deleted Successfully")
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

                let Inbound_Delivery_No = this.getView().byId("Inbound_Delivery_No_H").getValue();
                let SAP_UUID_H = this.getView().byId("SAP_UUID_H").getValue();

                // ---------- Start Item Level

                var Table_Id = this.getView().byId("salessto");
                var Table_Length = Table_Id.getRows().length;

                for (var i = 0; i < Table_Length; i++) {
                var oRow = Table_Id.getRows()[i];
                var oBindingContext = oRow.mAggregations;

                if (oBindingContext) {
                    var Gate_Quantity_To_Post = oBindingContext.cells[6].mProperties.value;
                    var SAP_UUID_I = oBindingContext.cells[15].mProperties.value;
                    var Delete_Status01 = oRow.getCells()[0].getVisible();

                    if (Gate_Quantity_To_Post !== "") {
                        var Delete_Status = "";
                        
                    var itemData = {
                        Status: Delete_Status
                    };

                    var oModel_04 = this.getView().getModel("YY1_SALES_STO_CDS");
                    oModel_04.setHeaders({
                        "X-Requested-With": "X",
                        "Content-Type": "application/json"
                    });

                    oModel_04.update("/YY1_ITEM_SALES_STO(guid'" + SAP_UUID_I + "')", itemData, {
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

                var oModel05 = this.getView().getModel("YY1_SALES_STO_CDS");
                oModel05.setHeaders({
                "X-Requested-With": "X",
                "Content-Type": "application/json"
                });

                oModel05.update("/YY1_SALES_STO(guid'" + SAP_UUID_H + "')", oEntry1, {
                success: function(data) {
                    console.log("Header Updated:", data);
                    that._pBusyDialog.close();
                    MessageToast.show(" "+Inbound_Delivery_No+" UnDeleted Successfully")        
                    oModel05.refresh(true);
                    that.getView().byId("DeleteIndicId").setVisible(false); 
                    that.getView().byId("Final_Update_Button").setVisible(true); 
                    that.getView().byId("Final_DeleteEntireDocument_Button").setVisible(true);
                    that.getView().byId("UnFinal_DeleteEntireDocument_Button").setVisible(false);
                },
                error: function(error) {
                    console.error("Error updating header:", error);
                    that._pBusyDialog.close();
                    MessageToast.show(" "+Inbound_Delivery_No+" Not UnDeleted Successfully")
                }
                });

                // ---------- End Item Level

                


            }

        });
    });
