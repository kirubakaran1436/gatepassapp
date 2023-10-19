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

        return Controller.extend("gatepass.controller.outword.returnable_challan.edit_returnable_challan", {
            onInit: function () {

            },
            
            OnBack:function(oEvent){
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			        oRouter.navTo("returnable_challan_ow");
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
                var oTable = this.byId("persoTable");
                var oTableRows = oTable.getRows();
                var aIndices = this.byId("persoTable").getSelectedIndices();
                
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
        
            OnRtrClnNoFrag:function(oEvent){
            if (!this._dialog_GenPurDocNo) {
                this._dialog_GenPurDocNo = sap.ui.xmlfragment(this.getView().getId("INRtnCln_dialog"), "gatepass.view.fragments.OUT_Returnable_Challan_Head", this);
                this.getView().addDependent(this._dialog_GenPurDocNo);
            }
            this._dialog_GenPurDocNo.open();
        },

        OnINRtnClnSearch: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter("Id", FilterOperator.Contains, sValue);
            var oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([oFilter]);
        },

        OnINRtnClnSelect : function (oEvent) {

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
                let Dataa = this.getView().byId("Returnable_Challan_H").getValue();
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
                    this.getView().byId("Returnable_Challan_H").setValue(GenPurDocNo);
                    this.getView().byId("SAP_UUID_H").setValue(SAP_UUID_H);
                }
    
                var filter = new sap.ui.model.Filter("Id", sap.ui.model.FilterOperator.EQ, GenPurDocNo);
                var model0 = this.getOwnerComponent().getModel("YY1_RETURN_CHALLAN_OW_CDS");
                var that = this;
                model0.read("/YY1_RETURN_CHALLAN_OW", {
                    filters: [filter], 
                    success: function (ODat, oRespons) {
                        var value11 = ODat.results[0];  
                        var SAPUIID = value11.SAP_UUID;
                        var Status = value11.Status;

                        that.getView().byId("GatePass_Type_H").setValue(value11.Gate_Entry_Type);
                        that.getView().byId("Material_Document_H").setValue(value11.Material_Document_No);
                        that.getView().byId("Material_Document_year_H").setValue(value11.Material_Document_year);
                        that.getView().byId("Plant_H").setValue(value11.Plant);
                        that.getView().byId("Plant_Name_H").setValue(value11.Plant_Name);
                        that.getView().byId("Vendor_H").setValue(value11.Vendor_Code);
                        that.getView().byId("Vendor_Name_H").setValue(value11.Vendor_Name);
                        that.getView().byId("Customer_Code_H").setValue(value11.Customer_Code);
                        that.getView().byId("Customer_Name_H").setValue(value11.Customer_Name);
                        that.getView().byId("Bin_Challan_No").setValue(value11.Bin_Challan_No);
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

                        model0.read("/YY1_RETURN_CHALLAN_OW(guid'" + SAPUIID + "')/to_Item", {
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
                        
                        var oFilter = new sap.ui.model.Filter("Material_Document_Item", sap.ui.model.FilterOperator.EQ, PoItem);
                        var oFilter1 = new sap.ui.model.Filter("Material_Document_No", sap.ui.model.FilterOperator.EQ, PoNo);
                        var oFilter2 = new sap.ui.model.Filter("Material_Document_year", sap.ui.model.FilterOperator.EQ, Vendor);
                        var oFilter3 = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, '');
                
                        var oModel = that.getView().getModel("YY1_RETURN_CHALLAN_OW_CDS");
                        var oFilters = [oFilter, oFilter1, oFilter2, oFilter3];

                        var CalData = 0;
                
                        oModel.read("/YY1_ITEM_RETURN_CHALLAN_OW", {
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

        OnPendingQty:function(value1, value2, value3, value4, value5, value6){
                        var that = this;
                        var PoItem = value2;
                        var PoNo = value3;
                        var Vendor = value4;
                        var OrderQuantity = parseFloat(value5);
                        var GateToPostQty = parseFloat(value6);
                
                    return new Promise(function(resolve, reject) {                        
                
                        var oFilter = new sap.ui.model.Filter("Material_Document_Item", sap.ui.model.FilterOperator.EQ, PoItem);
                        var oFilter1 = new sap.ui.model.Filter("Material_Document_No", sap.ui.model.FilterOperator.EQ, PoNo);
                        var oFilter2 = new sap.ui.model.Filter("Material_Document_year", sap.ui.model.FilterOperator.EQ, Vendor);
                        var oFilter3 = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, '');
                
                        var oModel01 = that.getView().getModel("YY1_RETURN_CHALLAN_OW_CDS");
                        var oFilters = [oFilter, oFilter1, oFilter2, oFilter3];

                        var CalData = 0;
                
                        oModel01.read("/YY1_ITEM_RETURN_CHALLAN_OW", {
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
                            var oFilter = new sap.ui.model.Filter("Material_Document_Item", sap.ui.model.FilterOperator.EQ, PoItem);
                            var oFilter1 = new sap.ui.model.Filter("Material_Document_No", sap.ui.model.FilterOperator.EQ, PoNo);
                            var oFilter2 = new sap.ui.model.Filter("Material_Document_year", sap.ui.model.FilterOperator.EQ, Vendor);
                            var oFilter3 = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, '');
                    
                            var oModel01 = that.getView().getModel("YY1_RETURN_CHALLAN_OW_CDS");
                            var oFilters = [oFilter, oFilter1, oFilter2, oFilter3];
    
                            var CalData = 0;
                    
                            oModel01.read("/YY1_ITEM_RETURN_CHALLAN_OW", {
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

            OnGateQtyToPostEnter:function(oEvent){
                    let Quantity_to_Post_Input = oEvent.getSource().getParent().getCells()[7].getValue(); 
                    let GatePendingQty = oEvent.getSource().getParent().getCells()[6].getValue(); 
                    let OrderQuantity = oEvent.getSource().getParent().getCells()[4].getValue(); 
                    
                    if (Quantity_to_Post_Input === ""){
                        oEvent.getSource().getParent().getCells()[7].setValue("0"); 
                        this.getView().byId("Final_Update_Button").setEnabled(true);
                    }else{
                        this.getView().byId("Final_Update_Button").setEnabled(false);
                    let PoItem = oEvent.getSource().getParent().getCells()[1].getValue(); 
                    let PoNo = oEvent.getSource().getParent().getCells()[2].getValue(); 
                    let Vendor = oEvent.getSource().getParent().getCells()[3].getValue(); 
                    let Id = this.getView().byId("Returnable_Challan_H").getValue();

                    let Quantity_to_Post_Input_Float = parseFloat(Quantity_to_Post_Input);
                    let OrderQuantity_Float = parseFloat(OrderQuantity);

                    var oFilter = new sap.ui.model.Filter("Material_Document_Item", sap.ui.model.FilterOperator.EQ, PoItem);
                    var oFilter1 = new sap.ui.model.Filter("Material_Document_No", sap.ui.model.FilterOperator.EQ, PoNo);
                    var oFilter2 = new sap.ui.model.Filter("Material_Document_year", sap.ui.model.FilterOperator.EQ, Vendor);
                    var oFilter3 = new sap.ui.model.Filter("Id", sap.ui.model.FilterOperator.EQ, Id);

                    var that = this;
                
                        var oModel02 = this.getView().getModel("YY1_RETURN_CHALLAN_OW_CDS");
                        var oModel03 = this.getView().getModel("YY1_RETURN_CHALLAN_OW_CDS");
                        var oFilters = [oFilter, oFilter1, oFilter2, oFilter3];
                
                        oModel02.read("/YY1_ITEM_RETURN_CHALLAN_OW", {
                            filters: oFilters,
                            success: function(oData) {
                                var aItems01 = oData.results;
                                
                                console.log(aItems01[0].Quantity_To_Post); 

                                var Clone_Quantity_to_Post_Input_Float = parseFloat(aItems01[0].Quantity_To_Post);

                                // -----------------------------------
                
                        
                        var oFilters = [oFilter, oFilter1, oFilter2];

                        var CalData = 0;
                
                        oModel03.read("/YY1_ITEM_RETURN_CHALLAN_OW", {
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
                                    oEvent.getSource().getParent().getCells()[7].setValue(Clone_Quantity_to_Post_Input_Float);
                                    // oEvent.getSource().getParent().getCells()[7].setValueState(sap.ui.core.ValueState.Error);
                                    console.log("If Condition 01");
                                    that.getView().byId("Final_Update_Button").setEnabled(true);
                                }else{
                                    oEvent.getSource().getParent().getCells()[7].setValueState(sap.ui.core.ValueState.None);
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

                let Returnable_Challan_H = this.getView().byId("Returnable_Challan_H").getValue();
                let SAP_UUID_H = this.getView().byId("SAP_UUID_H").getValue();
                let Gate_Pass_Type = this.getView().byId("GatePass_Type_H").getValue();
                let Plant = this.getView().byId("Plant_H").getValue();
                let Plant_Name = this.getView().byId("Plant_Name_H").getValue();
                let Material_Document_H = this.getView().byId("Material_Document_H").getValue();
                let Vendor_Code = this.getView().byId("Vendor_H").getValue();
                let Vendor_Name = this.getView().byId("Vendor_Name_H").getValue();
                let Customer_Code = this.getView().byId("Customer_Code_H").getValue();
                let Customer_Name = this.getView().byId("Customer_Name_H").getValue();
                let No_Of_Packages = this.getView().byId("No_Of_Package").getValue();
                let Vehicle_No = this.getView().byId("Vehicle_No_H").getValue();
                let Bins = this.getView().byId("Bin_Select_H").getValue();
                let No_Of_Bins = this.getView().byId("No_Of_Bins").getValue();
                let Transporter = this.getView().byId("Transporter").getValue();
                let Bin_Challan_No = this.getView().byId("Bin_Challan_No").getValue();

                // ---------- Start Item Level

                if (Returnable_Challan_H !== "" && Gate_Pass_Type !== ""){

                    var Table_Id = this.getView().byId("persoTable");
                var Table_Length = Table_Id.getRows().length;

                for (var i = 0; i < Table_Length; i++) {
                var oRow = Table_Id.getRows()[i];
                var oBindingContext = oRow.mAggregations;

                if (oBindingContext) {
                    var Quantity_To_Post = oBindingContext.cells[7].mProperties.value;
                    var SAP_UUID_I = oBindingContext.cells[14].mProperties.value;
                    var Delete_Status01 = oRow.getCells()[0].getVisible();

                    if (Quantity_To_Post !== "") {
                        if(Delete_Status01 === true){
                            var Delete_Status = "deleted";
                        }
                        if (Delete_Status01 === false){
                            var Delete_Status = "";
                        }
                    var itemData = {
                        Quantity_To_Post: Quantity_To_Post,
                        Status: Delete_Status
                    };

                    var oModel_04 = this.getView().getModel("YY1_RETURN_CHALLAN_OW_CDS");
                    oModel_04.setHeaders({
                        "X-Requested-With": "X",
                        "Content-Type": "application/json"
                    });

                    oModel_04.update("/YY1_ITEM_RETURN_CHALLAN_OW(guid'" + SAP_UUID_I + "')", itemData, {
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
                    VehicleNumber:Vehicle_No,
                    Bins:Bins,
                    NO_Of_Bins:No_Of_Bins,
                    Transporter:Transporter,
                    Bin_Challan_No:Bin_Challan_No
                };

                var that = this;

                var oModel05 = this.getView().getModel("YY1_RETURN_CHALLAN_OW_CDS");
                oModel05.setHeaders({
                "X-Requested-With": "X",
                "Content-Type": "application/json"
                });

                oModel05.update("/YY1_RETURN_CHALLAN_OW(guid'" + SAP_UUID_H + "')", oEntry1, {
                success: function(data) {
                    console.log("Header Updated:", data);
                    that._pBusyDialog.close();
                    MessageToast.show(" "+Returnable_Challan_H+" Updated Successfully")        
                    oModel05.refresh(true);
                    location.reload();
                },
                error: function(error) {
                    console.error("Error updating header:", error);
                    that._pBusyDialog.close();
                    MessageToast.show(" "+Returnable_Challan_H+" Not Updated Successfully")
                }
                });

                // ---------- End Item Level

                }else{
                    this._pBusyDialog.close();
                    if (Returnable_Challan_H === ""){
                        this.getView().byId("Returnable_Challan_H").setValueState(sap.ui.core.ValueState.Error)
                        
                    }else{
                        this.getView().byId("Returnable_Challan_H").setValueState(sap.ui.core.ValueState.None)
                    }

                    if(Gate_Pass_Type === ""){
                        this.getView().byId("GatePass_Type_H").setValueState(sap.ui.core.ValueState.Error)
                    }else{
                        this.getView().byId("GatePass_Type_H").setValueState(sap.ui.core.ValueState.None)
                    }
                }


            },

            
            OnDeleteEntireDocument:function(){

                // MessageBox.error("Do you confirm to delete entire document", {
                //     actions: ["Confirm", MessageBox.Action.CLOSE],
                //     emphasizedAction: "Confirm",
                //     onClose: function (sAction) {
                //         if(sAction === "Confirm"){}
                //     }
                // });

                // ------- Loder Model Boc Open - Enable ----------------
                if (!this._pBusyDialog) {
                    this._pBusyDialog = sap.ui.xmlfragment(this.getView().getId("BusyDialog"), "gatepass.view.fragments.BusyIndicator", this);
                    this.getView().addDependent(this._pBusyDialog);
                }
                this._pBusyDialog.open();
                // ------- Loder Model Boc Open - Enable ----------------

                let Returnable_Challan_H = this.getView().byId("Returnable_Challan_H").getValue();
                let SAP_UUID_H = this.getView().byId("SAP_UUID_H").getValue();

                // ---------- Start Item Level

                var Table_Id = this.getView().byId("persoTable");
                var Table_Length = Table_Id.getRows().length;

                for (var i = 0; i < Table_Length; i++) {
                var oRow = Table_Id.getRows()[i];
                var oBindingContext = oRow.mAggregations;

                if (oBindingContext) {
                    var Quantity_To_Post = oBindingContext.cells[7].mProperties.value;
                    var SAP_UUID_I = oBindingContext.cells[14].mProperties.value;
                    var Delete_Status01 = oRow.getCells()[0].getVisible();

                    if (Quantity_To_Post !== "") {
                        var Delete_Status = "deleted";
                        
                    var itemData = {
                        Status: Delete_Status
                    };

                    var oModel_04 = this.getView().getModel("YY1_RETURN_CHALLAN_OW_CDS");
                    oModel_04.setHeaders({
                        "X-Requested-With": "X",
                        "Content-Type": "application/json"
                    });

                    oModel_04.update("/YY1_ITEM_RETURN_CHALLAN_OW(guid'" + SAP_UUID_I + "')", itemData, {
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

                var oModel05 = this.getView().getModel("YY1_RETURN_CHALLAN_OW_CDS");
                oModel05.setHeaders({
                "X-Requested-With": "X",
                "Content-Type": "application/json"
                });

                oModel05.update("/YY1_RETURN_CHALLAN_OW(guid'" + SAP_UUID_H + "')", oEntry1, {
                success: function(data) {
                    console.log("Header Updated:", data);
                    that._pBusyDialog.close();
                    MessageToast.show(" "+Returnable_Challan_H+" Deleted Successfully")        
                    oModel05.refresh(true);
                    location.reload();
                },
                error: function(error) {
                    console.error("Error updating header:", error);
                    that._pBusyDialog.close();
                    MessageToast.show(" "+Returnable_Challan_H+" Not Deleted Successfully")
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

                let Returnable_Challan_H = this.getView().byId("Returnable_Challan_H").getValue();
                let SAP_UUID_H = this.getView().byId("SAP_UUID_H").getValue();

                // ---------- Start Item Level

                var Table_Id = this.getView().byId("persoTable");
                var Table_Length = Table_Id.getRows().length;

                for (var i = 0; i < Table_Length; i++) {
                var oRow = Table_Id.getRows()[i];
                var oBindingContext = oRow.mAggregations;

                if (oBindingContext) {
                    var Quantity_To_Post = oBindingContext.cells[7].mProperties.value;
                    var SAP_UUID_I = oBindingContext.cells[14].mProperties.value;
                    var Delete_Status01 = oRow.getCells()[0].getVisible();

                    if (Quantity_To_Post !== "") {
                        var Delete_Status = "";
                        
                    var itemData = {
                        Status: Delete_Status
                    };

                    var oModel_04 = this.getView().getModel("YY1_RETURN_CHALLAN_OW_CDS");
                    oModel_04.setHeaders({
                        "X-Requested-With": "X",
                        "Content-Type": "application/json"
                    });

                    oModel_04.update("/YY1_ITEM_RETURN_CHALLAN_OW(guid'" + SAP_UUID_I + "')", itemData, {
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

                var oModel05 = this.getView().getModel("YY1_RETURN_CHALLAN_OW_CDS");
                oModel05.setHeaders({
                "X-Requested-With": "X",
                "Content-Type": "application/json"
                });

                oModel05.update("/YY1_RETURN_CHALLAN_OW(guid'" + SAP_UUID_H + "')", oEntry1, {
                success: function(data) {
                    console.log("Header Updated:", data);
                    that._pBusyDialog.close();
                    MessageToast.show(" "+Returnable_Challan_H+" UnDeleted Successfully")        
                    oModel05.refresh(true);
                    location.reload();
                },
                error: function(error) {
                    console.error("Error updating header:", error);
                    that._pBusyDialog.close();
                    MessageToast.show(" "+Returnable_Challan_H+" Not UnDeleted Successfully")
                }
                });

                // ---------- End Item Level

                


            }

        });
    });
