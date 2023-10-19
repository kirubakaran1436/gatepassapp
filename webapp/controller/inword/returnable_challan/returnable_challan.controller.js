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

        return Controller.extend("gatepass.controller.inword.returnable_challan.returnable_challan", {
            onInit: function () {

                this.getOwnerComponent().getModel("YY1_IN_RETURNABLE_CLN_CDS").read("/YY1_IN_RETURNABLE_CLN/$count", { /* Decalure Globally in the Create table Serial Number */
				success: $.proxy(function (oEvent, oResponse) {
                    let Count = Number(oResponse.body) + 1; // This should be a number, no need to use Number()
                    let CountLen = Count.toString(); // Convert to string to get its length
                    let AddData = "10004";
                    let Data = 5 - CountLen.length;
                    let CountArray = "";
                    for (let i = 0; i < Data; i++) {
                        CountArray += "0";
                    }
                    console.log(AddData + CountArray + Count); // Concatenate strings correctly
                    let LastId = AddData + CountArray + Count;
                    this.getView().byId("Id").setValue(LastId);
				}, this)
			    });
              
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

            OnMatDocDateChange:function(){
                let Mat_Doc_Date = this.getView().byId("Material_Docuement_Year_H").getValue();
                if(Mat_Doc_Date.trim() !== ""){
                    this.getView().byId("Material_Docuement_H").setEnabled(true);
                }else{
                    this.getView().byId("Material_Docuement_H").setEnabled(false);
                }
                
            },


            OnDisplayPage : function(oEvent){

                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("header_gatepass_report");
            },

            Quantity_to_Post_InputyLine:function(oEvent){
                let Quantity_to_Post_Input = oEvent.getSource().getParent().getCells()[6].getValue(); 
                let QuantityLine = oEvent.getSource().getParent().getCells()[2].getValue();
                let Pending_Quantity_Item = oEvent.getSource().getParent().getCells()[5].getValue();

                let Quantity_to_Post_Input_Float = parseFloat(Quantity_to_Post_Input);
                let QuantityLine_Float = parseFloat(QuantityLine);
                let Pending_Quantity_Item_Float = parseFloat(Pending_Quantity_Item);

                if(Quantity_to_Post_Input_Float > Pending_Quantity_Item_Float){
                    MessageToast.show("Please Enter Valid Quantity...!");
                    // oEvent.getSource().getParent().getCells()[6].setValue(QuantityLine);
                    oEvent.getSource().getParent().getCells()[6].setValueState(sap.ui.core.ValueState.Error);
                    oEvent.getSource().getParent().getCells()[6].setValueStateText("Please Enter Valid Quantity");
                    // this.getView().byId("OnSubmit").setEnabled(false);
                    // oEvent.getSource().getParent().getCells()[5].setValue("");
                    // oEvent.getSource().getParent().getCells()[3].setValue("");
                    this.getView().byId("Final_Save_Button").setEnabled(false);
                    this.getView().byId("Final_Save_Button").setEnabled(false);

                }else if(Quantity_to_Post_Input_Float === "" || Quantity_to_Post_Input_Float === "0" || Quantity_to_Post_Input_Float === 0 ){
                    oEvent.getSource().getParent().getCells()[6].setValue("0");
                    oEvent.getSource().getParent().getCells()[6].setValueState(sap.ui.core.ValueState.Error);
                    oEvent.getSource().getParent().getCells()[6].setValueStateText("Please enter atleast one value");
                    // oEvent.getSource().getParent().getCells()[5].setValue("");
                    // oEvent.getSource().getParent().getCells()[3].setValue("");
                    this.getView().byId("Final_Save_Button").setEnabled(false);
                    
                }

                else if (Quantity_to_Post_Input_Float <= Pending_Quantity_Item_Float) {
                    oEvent.getSource().getParent().getCells()[6].setValueState(sap.ui.core.ValueState.None);
                    // this.getView().byId("OnSubmit").setEnabled(true);

                    let A01 = Pending_Quantity_Item_Float - Quantity_to_Post_Input_Float;

                    // oEvent.getSource().getParent().getCells()[5].setValue(A01);
                    // oEvent.getSource().getParent().getCells()[3].setValue(Quantity_to_Post_Input_Float);

                    this.getView().byId("Final_Save_Button").setEnabled(true);

                }

            },

            OnReceivedQtyCal: function(PoItem, OrderQuantity, year) {

                    var that = this; // Store reference to 'this'
                    var OrderQuantity = parseFloat(OrderQuantity);
                
                    return new Promise(function(resolve, reject) {
                        var PoNo = that.getView().byId("Material_Docuement_H").getValue();
                        var Vendor = that.getView().byId("Vendor_Code_H").getValue();
                
                        var oFilter = new sap.ui.model.Filter("Material_Document_Item", sap.ui.model.FilterOperator.EQ, PoItem);
                        var oFilter1 = new sap.ui.model.Filter("Material_Document_No", sap.ui.model.FilterOperator.EQ, PoNo);
                        var oFilter2 = new sap.ui.model.Filter("Material_Document_Year", sap.ui.model.FilterOperator.EQ, year);
                        // var oFilter3 = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, '');
                
                        var oModel = that.getView().getModel("YY1_IN_RETURNABLE_CLN_CDS");
                        var oFilters = [oFilter, oFilter1, oFilter2];

                        var CalData = 0;
                
                        oModel.read("/YY1_ITEMS_IN_RETURNABLE_CLN", {
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
            
            OnPendingQtyCal: function(PoItem, OrderQuantity, year) {

                    var that = this; // Store reference to 'this'
                    var OrderQuantity = OrderQuantity;
                
                    return new Promise(function(resolve, reject) {
                        var PoNo = that.getView().byId("Material_Docuement_H").getValue();
                        var Vendor = that.getView().byId("Vendor_Code_H").getValue();
                
                        var oFilter = new sap.ui.model.Filter("Material_Document_Item", sap.ui.model.FilterOperator.EQ, PoItem);
                        var oFilter1 = new sap.ui.model.Filter("Material_Document_No", sap.ui.model.FilterOperator.EQ, PoNo);
                        var oFilter2 = new sap.ui.model.Filter("Material_Document_Year", sap.ui.model.FilterOperator.EQ, year);
                        // var oFilter3 = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, '');
                
                        var oModel = that.getView().getModel("YY1_IN_RETURNABLE_CLN_CDS");
                        var oFilters = [oFilter, oFilter1, oFilter2];

                        var CalData = 0;
                
                        oModel.read("/YY1_ITEMS_IN_RETURNABLE_CLN", {
                            filters: oFilters,
                            success: function(oData) {
                                var aItems = oData.results;
                                for (var i = 0; i < aItems.length; i++) {
                                    CalData += parseFloat(aItems[i].Quantity_To_Post);
                                }
                                console.log("---------------------------------------------");
                                console.log(OrderQuantity);
                                console.log(CalData);
                                var FinalData = parseFloat(OrderQuantity) - parseFloat(CalData);
                                console.log(FinalData);
                                console.log("---------------------------------------------");
                                resolve(FinalData); // Resolve with the data
                            },
                            error: function(oError) {
                                console.error("Error reading data: ", oError);
                                reject(oError); // Reject with the error
                            }
                        });
                    });
            },           
            
            OnPutQtyENDB: function(PoItem, OrderQuantity, year) {

                    var that = this; // Store reference to 'this'
                    var OrderQuantity = OrderQuantity;
                
                    return new Promise(function(resolve, reject) {
                        var PoNo = that.getView().byId("Material_Docuement_H").getValue();
                        var Vendor = that.getView().byId("Vendor_Code_H").getValue();
                
                        var oFilter = new sap.ui.model.Filter("Material_Document_Item", sap.ui.model.FilterOperator.EQ, PoItem);
                        var oFilter1 = new sap.ui.model.Filter("Material_Document_No", sap.ui.model.FilterOperator.EQ, PoNo);
                        var oFilter2 = new sap.ui.model.Filter("Material_Document_Year", sap.ui.model.FilterOperator.EQ, year);
                        // var oFilter3 = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, '');
                
                        var oModel = that.getView().getModel("YY1_IN_RETURNABLE_CLN_CDS");
                        var oFilters = [oFilter, oFilter1, oFilter2];

                        var CalData = 0;
                
                        oModel.read("/YY1_ITEMS_IN_RETURNABLE_CLN", {
                            filters: oFilters,
                            success: function(oData) {
                                var aItems = oData.results;
                                for (var i = 0; i < aItems.length; i++) {
                                    CalData += parseFloat(aItems[i].Quantity_To_Post);
                                }
                                console.log("---------------------------------------------");
                                console.log(OrderQuantity);
                                console.log(CalData);
                                var FinalData = parseFloat(OrderQuantity) - parseFloat(CalData);
                                console.log(FinalData);
                                if (FinalData === 0 || FinalData === "0"){
                                    var Status = false;
                                }else{
                                    var Status = true;
                                }
                                console.log("---------------------------------------------");
                                resolve(Status); // Resolve with the data
                            },
                            error: function(oError) {
                                console.error("Error reading data: ", oError);
                                reject(oError); // Reject with the error
                            }
                        });
                    });
            },           
            

          
            On_Go_Button:function(){

                // ------- Loder Model Boc Open - Enable ----------------
                if (!this._pBusyDialog) {
                    this._pBusyDialog = sap.ui.xmlfragment(this.getView().getId("BusyDialog"), "gatepass.view.fragments.BusyIndicator", this);
                    this.getView().addDependent(this._pBusyDialog);
                }
                this._pBusyDialog.open();
                // ------- Loder Model Boc Open - Enable ----------------

                var Material_Docuement_H = this.getView().byId("Material_Docuement_H").getValue();
                var GatePass_Type_H = this.getView().byId("GatePass_Type_H").getValue();
                this.getView().byId("Final_Cancel_Button").setEnabled(true);

                if(Material_Docuement_H !== "" && GatePass_Type_H !== ""){ // po no & Invoice No - Both Not Empty
                    this.getView().byId("RetunableChallenTable").setVisible(true);
                    this.getView().byId("Final_Save_Button").setEnabled(false);
                    this.getView().byId("Material_Docuement_H").setValueState(sap.ui.core.ValueState.None);
                    this.getView().byId("Material_Docuement_H").setValueStateText("");
                    this.getView().byId("GatePass_Type_H").setValueState(sap.ui.core.ValueState.None);
                    this.getView().byId("GatePass_Type_H").setValueStateText("");

                    // ------------------------------

                    var oFilter = new sap.ui.model.Filter("MaterialDocument", sap.ui.model.FilterOperator.EQ, Material_Docuement_H);

                    var oTable = this.byId("RetunableChallenTable");
                    var oModel = this.getView().getModel("YY1_OW_RETURNABLE_CLN_ITEM_CDS"); // Replace with your actual OData model name

                    var oFilters = [oFilter];

                    var that = this;

                    oModel.read("/YY1_OW_Returnable_Cln_Item", {
                        filters: oFilters,
                        success: function(oData) {
                            var aItems = oData.results; // The array of read items
                        
                            // Create a JSON model and set the data
                            var oTableModel = new sap.ui.model.json.JSONModel();
                            oTableModel.setData({ items: aItems });
                        
                            // Set the model on the table and bind the rows
                            oTable.setModel(oTableModel);
                            oTable.bindRows("/items");
                            that._pBusyDialog.close();
                        },
                        error: function(oError) {
                            // Handle error
                            console.error("Error reading data: ", oError);
                            that._pBusyDialog.close();
                        }
                    });



                    console.log(oModel);

                }else{
                    this.getView().byId("RetunableChallenTable").setVisible(false);
                    this.getView().byId("Final_Save_Button").setEnabled(false);
                    this._pBusyDialog.close();
                }
                    // ------------------

                    if(Material_Docuement_H == ""){
                        this.getView().byId("Material_Docuement_H").setValueState(sap.ui.core.ValueState.Error);
                        this.getView().byId("Material_Docuement_H").setValueStateText("Please Enter Material Document No");
                    }else{
                        this.getView().byId("Material_Docuement_H").setValueState(sap.ui.core.ValueState.None);
                        this.getView().byId("Material_Docuement_H").setValueStateText("");
                    }

                    if (GatePass_Type_H == "" ){ // Both is equal to empty
                        this.getView().byId("GatePass_Type_H").setValueState(sap.ui.core.ValueState.Error);
                        this.getView().byId("GatePass_Type_H").setValueStateText("Please select any Gate Pass type");
                    }else{                     
                        this.getView().byId("GatePass_Type_H").setValueState(sap.ui.core.ValueState.None);
                        this.getView().byId("GatePass_Type_H").setValueStateText("");
                    }


                },

                OnMatDocFragOpen:function(oEvent){

                let Get_Mat_Doc_Date = this.getView().byId("Material_Docuement_Year_H").getValue();
            // ====================================================================
                var oFilter1 = new sap.ui.model.Filter("MaterialDocumentYear", sap.ui.model.FilterOperator.EQ, Get_Mat_Doc_Date);
                // var oFilter2 = new sap.ui.model.Filter("GoodsMovementType", sap.ui.model.FilterOperator.EQ,"541");
                var oModel1 = this.getView().getModel("YY1_OW_RETURNABLE_CHALLAN__CDS"); // Replace with your actual OData model name
                var oFilters1 = [oFilter1];
                var that = this;

                oModel1.read("/YY1_OW_Returnable_Challan_", {
                    filters: oFilters1,
                    success: function (oData) {
                        var aItems = oData.results; // The array of read items
                        var oJSONModel = new sap.ui.model.json.JSONModel({
                            data: aItems
                        });
                       console.log(oJSONModel);
                        that.getView().setModel(oJSONModel, "JModel");
                    },
                    error: function (oError) {
                        console.error("Error reading data: ", oError);
                    }
                })
            // ====================================================================


                    if (!this._dialog_podochead) {
                        this._dialog_podochead = sap.ui.xmlfragment(this.getView().getId("MatDoc_dialog"), "gatepass.view.fragments.Material_Document_Head", this);
                        this.getView().addDependent(this._dialog_podochead);
                    }
                    this._dialog_podochead.open();
                },

                OnMatDocSearch: function (oEvent) {
                    var sValue = oEvent.getParameter("value");
                    var oFilter = new Filter("MaterialDocument", FilterOperator.Contains, sValue);
                    var oBinding = oEvent.getSource().getBinding("items");
                    oBinding.filter([oFilter]);
                },

                OnMatDocSelect : function (oEvent) {

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
                    console.log(aContexts)
                    var var1, var2, var3;

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

                    if (aContexts && aContexts.length) {

                        aContexts.map(function (oContext) {
                            var1 = oContext.getObject().MaterialDocument;
                            var2 = oContext.getObject().MaterialDocumentYear;
                            var3 = oContext.getObject().PostingDate;
                            return;
                        });
                        this.getView().byId("Material_Docuement_H").setValue(var1);
                        this.getView().byId("Material_Docuement_Year_H").setValue(var2);
                        // this.getView().byId("Vendor_Name_H").setValue(var3);
                    }

                    var Material_Docuement_H = this.getView().byId("Material_Docuement_H").getValue();
                    var oFilter1 = new sap.ui.model.Filter("MaterialDocument", sap.ui.model.FilterOperator.EQ, var1);
                    var oModel1 = this.getView().getModel("YY1_OW_RETURNABLE_CLN_ITEM_CDS"); // Replace with your actual OData model name
                    
                    var oFilters1 = [oFilter1];
                    var that = this;
                    
                    oModel1.read("/YY1_OW_Returnable_Cln_Item", {
                        filters: oFilters1,
                        success: function(oData) {
                            var aItems = oData.results; // The array of read items
                            let Plant = aItems[0].Plant;
                            let PlantName = aItems[0].PlantName;
                            let vcode = aItems[0].Supplier;
                            let vname = aItems[0].SupplierName;
                            that.getView().byId("Plant_H").setValue(Plant);
                            that.getView().byId("Plant_Name_H").setValue(PlantName);
                            that.getView().byId("Vendor_Code_H").setValue(vcode);
                            that.getView().byId("Vendor_Name_H").setValue(vname);
                            that._pBusyDialog.close();
                    
                        },
                        error: function(oError) {
                            // Handle error
                            console.error("Error reading data: ", oError);
                            that._pBusyDialog.close();
                        }
                    });

                    if(Material_Docuement_H == ""){
                        this.getView().byId("Material_Docuement_H").setValueState(sap.ui.core.ValueState.Error);
                        this.getView().byId("Material_Docuement_H").setValueStateText("Please Enter Material Document No");
                    }else{
                        this.getView().byId("Material_Docuement_H").setValueState(sap.ui.core.ValueState.None);
                        this.getView().byId("Material_Docuement_H").setValueStateText("");
                    }
                }
                },  
                
                OnVendorFetch:function(oEvent){
                    let Dataa = this.getView().byId("Vendor_Code_H").getValue();
                    var data = new Promise(function (resolve) {

                        let Dataa1 = Dataa;
                        
                        resolve(Dataa1);
			            });
			        return data;
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
                
                OnVendorNameFetch:function(oEvent){
                    let Dataa = this.getView().byId("Vendor_Name_H").getValue();
                    var data = new Promise(function (resolve) {

                        let Dataa1 = Dataa;
                        
                        resolve(Dataa1);
			            });
			        return data;
                },
                
                OnNoOfPackageFetch:function(oEvent){
                    let Dataa = this.getView().byId("No_Of_Package").getValue();
                    var data = new Promise(function (resolve) {

                        let Dataa1 = Dataa;
                        
                        resolve(Dataa1);
			            });
			        return data;
                },
                
                OnVehicleNoFetch:function(oEvent){
                    let Dataa = this.getView().byId("Vehicle_No_H").getValue();
                    var data = new Promise(function (resolve) {

                        let Dataa1 = Dataa;
                        
                        resolve(Dataa1);
			            });
			        return data;
                },
                
                OnNoOfBinsFetch:function(oEvent){
                    let Dataa = this.getView().byId("No_Of_Bins").getValue();
                    var data = new Promise(function (resolve) {

                        let Dataa1 = Dataa;
                        
                        resolve(Dataa1);
			            });
			        return data;
                },
                
                OnBinsFetch:function(oEvent){
                    let Dataa = this.getView().byId("Bin_Select_H").getValue();
                    var data = new Promise(function (resolve) {

                        let Dataa1 = Dataa;
                        
                        resolve(Dataa1);
			            });
			        return data;
                },
                
                OnBack: function(oEvent){

                    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			        oRouter.navTo("View1");
                },

                OnEditPage:function(oEvent){
                    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			        oRouter.navTo("edit_returnable_challan");
                },

                
                OnCancel:function(){
                    var rel = window.reload
                    MessageBox.confirm("Are you sure do you want to close it...?.", {
                        actions: ["Yes", MessageBox.Action.CLOSE],
                        emphasizedAction: "Yes",
                        onClose: function (sAction) {
                            if(sAction === "Yes"){
                                // location.reload();
                                MessageToast.show("Closed");
                            }else{
                                MessageToast.show("Cancelled");
                            }
                        }
                    }); 
                },

                

                OnSubmit: function(oEvent){

                    // MessageToast.show("The Data Save Successfully...!");
                    // ------- Loder Model Boc Open - Enable ----------------
                    if (!this._pBusyDialog) {
                        this._pBusyDialog = sap.ui.xmlfragment(this.getView().getId("BusyDialog"), "gatepass.view.fragments.BusyIndicator", this);
                        this.getView().addDependent(this._pBusyDialog);
                    }
                    this._pBusyDialog.open();
                    // ------- Loder Model Boc Open - Enable ----------------

                   let Id = this.getView().byId("Id").getValue();
                   let Gate_Pass_Type = this.getView().byId("GatePass_Type_H").getValue();
                   let Plant = this.getView().byId("Plant_H").getValue();
                   let Plant_Name = this.getView().byId("Plant_Name_H").getValue();
                   let Material_Docuement_H = this.getView().byId("Material_Docuement_H").getValue();
                   let Material_Docuement_Year_H = this.getView().byId("Material_Docuement_Year_H").getValue();
                   let Vendor_Code = this.getView().byId("Vendor_Code_H").getValue();
                   let Vendor_Name = this.getView().byId("Vendor_Name_H").getValue();
                   let Customer_Doc_No = this.getView().byId("Customer_Doc_No").getValue();
                   let No_Of_Packages = this.getView().byId("No_Of_Package").getValue();
                   let Vehicle_No = this.getView().byId("Vehicle_No_H").getValue();
                   let Bins = this.getView().byId("Bin_Select_H").getValue();
                   let No_Of_Bins = this.getView().byId("No_Of_Bins").getValue();
                   let Transporter = this.getView().byId("Transporter").getValue();

				var Table_Id = this.getView().byId("RetunableChallenTable"); // Assuming 'RetunableChallenTable' is the ID of the Grid Table
                var oModel = Table_Id.getModel();
                var Table_Length = Table_Id.getRows().length;

                var itemData = [];

                for (var i = 0; i < Table_Length; i++) {
                    var oRow = Table_Id.getRows()[i];
                    var oBindingContext = oRow.getBindingContext();
                    if (oBindingContext) {
                        var MaterialDocumentItem = oBindingContext.getProperty("MaterialDocumentItem");
                        var MaterialDocumentYear = oBindingContext.getProperty("MaterialDocumentYear");
                        var MaterialDocument = oBindingContext.getProperty("MaterialDocument");
                        var Quantity = oBindingContext.getProperty("QuantityInBaseUnit");
                        var Received_Quantity = oBindingContext.getProperty("GRReceivedQuantity");
                        var Pending_Quantity = oBindingContext.getProperty("GatePendingQuantity");
                        var Quantity_To_Post_get = oBindingContext.getProperty("QuantityToPostInputLine");
                        if (Quantity_To_Post_get === undefined || Quantity_To_Post_get === null || Quantity_To_Post_get === "") {
                            var Quantity_To_Post = "0";
                        } else {
                            var Quantity_To_Post = Quantity_To_Post_get;                       
                         }
                      
                        var Material_Code = oBindingContext.getProperty("Material");
                        var Material_Description = oBindingContext.getProperty("ProductName");

                        itemData.push({
                            
                            Id:Id,
                            Gate_Entry_Type:Gate_Pass_Type,
                            Plant:Plant,
                            Plant_Name:Plant_Name,
                            Material_Document_Item:MaterialDocumentItem,
                            Material_Document_Year:MaterialDocumentYear,
                            Material_Document_No:MaterialDocument,
                            Quantity:Quantity,
                            UOM:"",
                            Received_Quantity:Received_Quantity,
                            Pending_Quantity:Pending_Quantity,
                            Quantity_To_Post:Quantity_To_Post,
                            Material_Code:Material_Code,
                            Material_Description:Material_Description,
                            Vendor_Code:Vendor_Code,
                            Vendor_Name:Vendor_Name,
                            No_Of_Packages:No_Of_Packages,
                            Bins:Bins,
                            No_Of_Bins:No_Of_Bins,
                            Bin_Challan_No:"",
                            Status:"",
                            Status01:"",
                            Transporter:Transporter,
                            Field01:"",
                            Field02:"",
                            Field03:"",
                            Field04:"",
                            Customer_Document_No:Customer_Doc_No,
                            Posting_Date:this.CurrentDate

                        });
                    }
                }
                            console.log(itemData);

                            var oEntry = {};

                            oEntry.Id= Id;
                            oEntry.Gate_Entry_Type= Gate_Pass_Type;
                            oEntry.Plant= Plant;
                            oEntry.Plant_Name= Plant_Name;
                            oEntry.Material_Document_No= Material_Docuement_H;
                            oEntry.Material_Document_Year= Material_Docuement_Year_H;
                            oEntry.Vendor_Code= Vendor_Code;
                            oEntry.Vendor_Name= Vendor_Name;
                            oEntry.Customer_Document_No= Customer_Doc_No;
                            oEntry.No_Of_Packages= No_Of_Packages;
                            oEntry.Bins= Bins;
                            oEntry.No_Of_Bins= No_Of_Bins;
                            oEntry.Bin_Challan_No= "";
                            oEntry.Status= "";
                            oEntry.Status01= "";
                            oEntry.Transporter= Transporter;
                            oEntry.Field01= "";
                            oEntry.Field02= "";
                            oEntry.Field03= "";
                            oEntry.Field04= "";
                            oEntry.Field05= "";
                            oEntry.Posting_Date=this.CurrentDate;

                            oEntry.to_Items = itemData;
                            this.getView().setModel();
                            var oModel = this.getOwnerComponent().getModel("YY1_IN_RETURNABLE_CLN_CDS");

                            var that = this;

                            oModel.create("/YY1_IN_RETURNABLE_CLN", oEntry, {
                                success: function (oData, oResponse) {

                                    that._pBusyDialog.close();
                                    oModel.refresh(true);
                                    oModel.refresh(true);
                                    MessageBox.success("Document No " + Id + " Generated", {
                                        title: "Subcontracting Goods Receipt",
                                        id: "messageBoxId1",
                                        contentWidth: "100px",
                                    });

                                    that.getView().byId("Id").setValue("");
                                    that.getView().byId("GatePass_Type_H").setValue("");
                                    that.getView().byId("Plant_H").setValue("");
                                    that.getView().byId("Plant_Name_H").setValue("");
                                    that.getView().byId("Material_Docuement_H").setValue("");
                                    that.getView().byId("Material_Docuement_Year_H").setValue("");
                                    that.getView().byId("Vendor_Code_H").setValue("");
                                    that.getView().byId("Vendor_Name_H").setValue("");
                                    that.getView().byId("Customer_Doc_No").setValue("");
                                    that.getView().byId("No_Of_Package").setValue("");
                                    that.getView().byId("Vehicle_No_H").setValue("");
                                    that.getView().byId("Bin_Select_H").setValue("");
                                    that.getView().byId("No_Of_Bins").setValue("");
                                    that.getView().byId("Transporter").setValue("");

                                    that.getOwnerComponent().getModel("YY1_IN_RETURNABLE_CLN_CDS").read("/YY1_IN_RETURNABLE_CLN/$count", { /* Decalure Globally in the Create table Serial Number */
                                    success: $.proxy(function (oEvent, oResponse) {
                                        let Count = Number(oResponse.body) + 1; // This should be a number, no need to use Number()
                                        let CountLen = Count.toString(); // Convert to string to get its length
                                        let AddData = "10004";
                                        let Data = 5 - CountLen.length;
                                        let CountArray = "";
                                        for (let i = 0; i < Data; i++) {
                                            CountArray += "0";
                                        }
                                        console.log(AddData + CountArray + Count); // Concatenate strings correctly
                                        let LastId = AddData + CountArray + Count;
                                        that.getView().byId("Id").setValue(LastId);
                                    }, that)
                                    });

                                    that.getView().byId("RetunableChallenTable").setVisible(false);
                                    that.getView().byId("Final_Save_Button").setEnabled(false);
                                }
                            });

                            
                                    
                        },

        });
    });
