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

        return Controller.extend("gatepass.controller.inword.general_purchase.general_purchase", {
            onInit: function () {

                this.getOwnerComponent().getModel("YY1_GENERAL_PURCHASE_CDS").read("/YY1_GENERAL_PURCHASE/$count", { /* Decalure Globally in the Create table Serial Number */
				success: $.proxy(function (oEvent, oResponse) {
                    let Count = Number(oResponse.body) + 1; // This should be a number, no need to use Number()
                    let CountLen = Count.toString(); // Convert to string to get its length
                    let AddData = "10002";
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
              

            // ----Start For Current Date -----
            var today = new Date();
			var dd = '' + today.getDate();
			var mm = '' + (today.getMonth() + 1); //January is 0!
			if (mm.length < 2) {
				mm = '0' + mm;
			}
			if (dd.length < 2) {
				dd = '0' + dd;
			}
			var yyyy = today.getFullYear();
            this.CurrentDate = dd + '-' + mm + '-' + yyyy;
            this.CurrentDate01 = yyyy + '-' + mm + '-' + dd;
			this.getView().byId("Invoice_Date_H").setValue(dd + '-' + mm + '-' + yyyy);
            // ----Start For Current Date -----

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

            OnReceivedQtyCal: function(PoItem, OrderQuantity) {

                    var that = this; // Store reference to 'this'
                    var OrderQuantity = parseFloat(OrderQuantity);
                
                    return new Promise(function(resolve, reject) {
                        var PoNo = that.getView().byId("Purchasing_Document_H").getValue();
                        var Vendor = that.getView().byId("Vendor_H").getValue();
                        
                
                        var oFilter = new sap.ui.model.Filter("Purchasing_Document_Item", sap.ui.model.FilterOperator.EQ, PoItem);
                        var oFilter1 = new sap.ui.model.Filter("Purchasing_Document", sap.ui.model.FilterOperator.EQ, PoNo);
                        var oFilter2 = new sap.ui.model.Filter("Vendor_Code", sap.ui.model.FilterOperator.EQ, Vendor);
                        var oFilter3 = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, '');
                
                        var oModel = that.getView().getModel("YY1_GENERAL_PURCHASE_CDS");
                        var oFilters = [oFilter, oFilter1, oFilter2, oFilter3];

                        var CalData = 0;
                
                        oModel.read("/YY1_TO_ITEM_GENERAL_PURCHASE", {
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
            
            OnPendingQtyCal: function(PoItem, OrderQuantity) {

                    var that = this; // Store reference to 'this'
                    var OrderQuantity = OrderQuantity;
                
                    return new Promise(function(resolve, reject) {
                        var PoNo = that.getView().byId("Purchasing_Document_H").getValue();
                        var Vendor = that.getView().byId("Vendor_H").getValue();
                        
                
                        var oFilter = new sap.ui.model.Filter("Purchasing_Document_Item", sap.ui.model.FilterOperator.EQ, PoItem);
                        var oFilter1 = new sap.ui.model.Filter("Purchasing_Document", sap.ui.model.FilterOperator.EQ, PoNo);
                        var oFilter2 = new sap.ui.model.Filter("Vendor_Code", sap.ui.model.FilterOperator.EQ, Vendor);
                        var oFilter3 = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, '');
                
                        var oModel = that.getView().getModel("YY1_GENERAL_PURCHASE_CDS");
                        var oFilters = [oFilter, oFilter1, oFilter2, oFilter3];

                        var CalData = 0;
                
                        oModel.read("/YY1_TO_ITEM_GENERAL_PURCHASE", {
                            filters: oFilters,
                            success: function(oData) {
                                var aItems = oData.results;
                                for (var i = 0; i < aItems.length; i++) {
                                    CalData += parseFloat(aItems[i].Gate_Quantity_To_Post);
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
            
            OnPutQtyENDB: function(PoItem, OrderQuantity) {

                    var that = this; // Store reference to 'this'
                    var OrderQuantity = OrderQuantity;
                
                    return new Promise(function(resolve, reject) {
                        var PoNo = that.getView().byId("Purchasing_Document_H").getValue();
                        var Vendor = that.getView().byId("Vendor_H").getValue();
                        
                
                        var oFilter = new sap.ui.model.Filter("Purchasing_Document_Item", sap.ui.model.FilterOperator.EQ, PoItem);
                        var oFilter1 = new sap.ui.model.Filter("Purchasing_Document", sap.ui.model.FilterOperator.EQ, PoNo);
                        var oFilter2 = new sap.ui.model.Filter("Vendor_Code", sap.ui.model.FilterOperator.EQ, Vendor);
                
                        var oModel = that.getView().getModel("YY1_GENERAL_PURCHASE_CDS");
                        var oFilters = [oFilter, oFilter1, oFilter2];

                        var CalData = 0;
                
                        oModel.read("/YY1_TO_ITEM_GENERAL_PURCHASE", {
                            filters: oFilters,
                            success: function(oData) {
                                var aItems = oData.results;
                                for (var i = 0; i < aItems.length; i++) {
                                    CalData += parseFloat(aItems[i].Gate_Quantity_To_Post);
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
            

            select_i_o:function(){
                var Purchasing_Document_H = this.getView().byId("Purchasing_Document_H").getValue();
                    var Invoice_No_H = this.getView().byId("Invoice_No_H").getValue();
                    var GatePass_Type_H = this.getView().byId("GatePass_Type_H").getValue();
                    this.getView().byId("Final_Cancel_Button").setEnabled(true);

                    if(Purchasing_Document_H !== "" && GatePass_Type_H !== ""){ // po no & Invoice No - Both Not Empty
                        this.getView().byId("persoTable").setVisible(true);
                        this.getView().byId("Final_Save_Button").setEnabled(false);
                        this.getView().byId("Purchasing_Document_H").setValueState(sap.ui.core.ValueState.None);
                        this.getView().byId("Purchasing_Document_H").setValueStateText("");
                        this.getView().byId("GatePass_Type_H").setValueState(sap.ui.core.ValueState.None);
                        this.getView().byId("GatePass_Type_H").setValueStateText("");

                        // ------------------------------

                        var oFilter = new sap.ui.model.Filter("PurchaseOrder", sap.ui.model.FilterOperator.EQ, Purchasing_Document_H);

                        var oTable = this.byId("persoTable");
                        var oModel = this.getView().getModel("YY1_PURCHASE_DOC_ITEMS_CDS"); // Replace with your actual OData model name
                        
                        var oFilters = [oFilter];
                        
                        oModel.read("/YY1_Purchase_Doc_Items", {
                            filters: oFilters,
                            success: function(oData) {
                                var aItems = oData.results; // The array of read items
                        
                                // Create a JSON model and set the data
                                var oTableModel = new sap.ui.model.json.JSONModel();
                                oTableModel.setData({ items: aItems });
                        
                                // Set the model on the table and bind the rows
                                oTable.setModel(oTableModel);
                                oTable.bindRows("/items");
                            },
                            error: function(oError) {
                                // Handle error
                                console.error("Error reading data: ", oError);
                            }
                        });
                        
                        

                        console.log(oModel);

                    }else{
                        this.getView().byId("persoTable").setVisible(false);
                        this.getView().byId("Final_Save_Button").setEnabled(false);
                    }
            },
                
                On_Go_Button:function(){

                    var Purchasing_Document_H = this.getView().byId("Purchasing_Document_H").getValue();
                    var Invoice_No_H = this.getView().byId("Invoice_No_H").getValue();
                    var GatePass_Type_H = this.getView().byId("GatePass_Type_H").getValue();
                    this.getView().byId("Final_Cancel_Button").setEnabled(true);

                    if(Purchasing_Document_H !== "" && GatePass_Type_H !== ""){ // po no & Invoice No - Both Not Empty
                        this.getView().byId("persoTable").setVisible(true);
                        this.getView().byId("Final_Save_Button").setEnabled(false);
                        this.getView().byId("Purchasing_Document_H").setValueState(sap.ui.core.ValueState.None);
                        this.getView().byId("Purchasing_Document_H").setValueStateText("");
                        this.getView().byId("GatePass_Type_H").setValueState(sap.ui.core.ValueState.None);
                        this.getView().byId("GatePass_Type_H").setValueStateText("");

                        // ------------------------------

                        var oFilter = new sap.ui.model.Filter("PurchaseOrder", sap.ui.model.FilterOperator.EQ, Purchasing_Document_H);

                        var oTable = this.byId("persoTable");
                        var oModel = this.getView().getModel("YY1_PURCHASE_DOC_ITEMS_CDS"); // Replace with your actual OData model name
                        
                        var oFilters = [oFilter];
                        
                        oModel.read("/YY1_Purchase_Doc_Items", {
                            filters: oFilters,
                            success: function(oData) {
                                var aItems = oData.results; // The array of read items
                        
                                // Create a JSON model and set the data
                                var oTableModel = new sap.ui.model.json.JSONModel();
                                oTableModel.setData({ items: aItems });
                        
                                // Set the model on the table and bind the rows
                                oTable.setModel(oTableModel);
                                oTable.bindRows("/items");
                            },
                            error: function(oError) {
                                // Handle error
                                console.error("Error reading data: ", oError);
                            }
                        });
                        
                        

                        console.log(oModel);

                    }else{
                        this.getView().byId("persoTable").setVisible(false);
                        this.getView().byId("Final_Save_Button").setEnabled(false);
                    }
                        // ------------------

                        if(Purchasing_Document_H == ""){
                            this.getView().byId("Purchasing_Document_H").setValueState(sap.ui.core.ValueState.Error);
                            this.getView().byId("Purchasing_Document_H").setValueStateText("Please Enter Purchase Document No");
                        }else{
                            this.getView().byId("Purchasing_Document_H").setValueState(sap.ui.core.ValueState.None);
                            this.getView().byId("Purchasing_Document_H").setValueStateText("");
                        }
                                                
                        if (GatePass_Type_H == "" ){ // Both is equal to empty
                            this.getView().byId("GatePass_Type_H").setValueState(sap.ui.core.ValueState.Error);
                            this.getView().byId("GatePass_Type_H").setValueStateText("Please select any Gate Pass type");
                        }else{                     
                            this.getView().byId("GatePass_Type_H").setValueState(sap.ui.core.ValueState.None);
                            this.getView().byId("GatePass_Type_H").setValueStateText("");
                        }


                },


                OnApproveSelect:function(oEvent){
                    var UserName = oEvent.oSource.getSelectedItem().getKey();
                    if(UserName === "Yes"){
                        if (!this._dialog001) {
                            this._dialog001 = sap.ui.xmlfragment(this.getView().getId("BUser_dialog"), "gatepass.view.fragments.Business_User", this);
                            this.getView().addDependent(this._dialog001);
                        }
                        this._dialog001.open();
                    }
                    
                    if(UserName === "No"){
                        this.getView().byId("Business_User_Name").setValue("");
                        this.getView().byId("Business_User_ID").setValue("");
                    }
                    
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
                        this.getView().byId("Business_User_Name").setValue(var1);
                        this.getView().byId("Business_User_ID").setValue(var2);
                    }
                },

                OnPoDocFragOpen:function(oEvent){
                    if (!this._dialog_podochead) {
                        this._dialog_podochead = sap.ui.xmlfragment(this.getView().getId("PoDocHead_dialog"), "gatepass.view.fragments.Po_Doc_Header", this);
                        this.getView().addDependent(this._dialog_podochead);
                    }
                    this._dialog_podochead.open();
                },

                OnPoDocHeadSearch: function (oEvent) {
                    var sValue = oEvent.getParameter("value");
                    var oFilter = new Filter("PurchaseOrder", FilterOperator.Contains, sValue);
                    var oBinding = oEvent.getSource().getBinding("items");
                    oBinding.filter([oFilter]);
                },

                OnPoDcoHeadSelect : function (oEvent) {
                    var oBinding = oEvent.getSource().getBinding("items");
                    oBinding.filter([]);

                    var aContexts = oEvent.getParameter("selectedContexts");
                    console.log(aContexts)
                    var pcode, vendor, vendor_name, plant;

                    if (aContexts && aContexts.length) {

                        aContexts.map(function (oContext) {
                            pcode = oContext.getObject().PurchaseOrder;
                            vendor = oContext.getObject().Supplier;
                            vendor_name = oContext.getObject().SupplierName;
                            // plant = oContext.getObject().PurchaseOrder;
                            return;
                        });
                        this.getView().byId("Purchasing_Document_H").setValue(pcode);
                        this.getView().byId("Vendor_H").setValue(vendor);
                        this.getView().byId("Vendor_Name_H").setValue(vendor_name);
                    }

                    var Purchasing_Document_H = this.getView().byId("Purchasing_Document_H").getValue();
                    var Invoice_No_H = this.getView().byId("Invoice_No_H").getValue();
                    var GatePass_Type_H = this.getView().byId("GatePass_Type_H").getValue();
                    this.getView().byId("Final_Cancel_Button").setEnabled(true);

                    if(Purchasing_Document_H !== "" && GatePass_Type_H !== ""){ // po no & Invoice No - Both Not Empty
                        this.getView().byId("persoTable").setVisible(true);
                        this.getView().byId("Final_Save_Button").setEnabled(false);
                        this.getView().byId("Purchasing_Document_H").setValueState(sap.ui.core.ValueState.None);
                        this.getView().byId("Purchasing_Document_H").setValueStateText("");
                        this.getView().byId("GatePass_Type_H").setValueState(sap.ui.core.ValueState.None);
                        this.getView().byId("GatePass_Type_H").setValueStateText("");

                        // ------------------------------

                        var oFilter = new sap.ui.model.Filter("PurchaseOrder", sap.ui.model.FilterOperator.EQ, Purchasing_Document_H);

                        var oTable = this.byId("persoTable");
                        var oModel = this.getView().getModel("YY1_PURCHASE_DOC_ITEMS_CDS"); // Replace with your actual OData model name
                        
                        var oFilters = [oFilter];
                        
                        oModel.read("/YY1_Purchase_Doc_Items", {
                            filters: oFilters,
                            success: function(oData) {
                                var aItems = oData.results; // The array of read items
                        
                                // Create a JSON model and set the data
                                var oTableModel = new sap.ui.model.json.JSONModel();
                                oTableModel.setData({ items: aItems });
                        
                                // Set the model on the table and bind the rows
                                oTable.setModel(oTableModel);
                                oTable.bindRows("/items");
                            },
                            error: function(oError) {
                                // Handle error
                                console.error("Error reading data: ", oError);
                            }
                        });
                        
                        

                        console.log(oModel);

                    }else{
                        this.getView().byId("persoTable").setVisible(false);
                        this.getView().byId("Final_Save_Button").setEnabled(false);
                    }

                    var oFilter1 = new sap.ui.model.Filter("PurchaseOrder", sap.ui.model.FilterOperator.EQ, Purchasing_Document_H);
                    var oModel1 = this.getView().getModel("YY1_PURCHASE_DOC_ITEMS_CDS"); // Replace with your actual OData model name
                    
                    var oFilters1 = [oFilter1];
                    var that = this;
                    
                    oModel1.read("/YY1_Purchase_Doc_Items", {
                        filters: oFilters1,
                        success: function(oData) {
                            var aItems = oData.results; // The array of read items
                            let lant_H = aItems[0].Plant;
                            that.getView().byId("Plant_H").setValue(lant_H);
                    
                        },
                        error: function(oError) {
                            // Handle error
                            console.error("Error reading data: ", oError);
                        }
                    });
                },  
                
                OnInvoiceNoChange:function(){
                    var Purchasing_Document_H = this.getView().byId("Purchasing_Document_H").getValue();
                    var Invoice_No_H = this.getView().byId("Invoice_No_H").getValue();
                    var GatePass_Type_H = this.getView().byId("GatePass_Type_H").getValue();
                    this.getView().byId("Final_Cancel_Button").setEnabled(true);

                    if(Purchasing_Document_H !== "" && GatePass_Type_H !== ""){ // po no & Invoice No - Both Not Empty
                        this.getView().byId("persoTable").setVisible(true);
                        this.getView().byId("Final_Save_Button").setEnabled(false);
                        this.getView().byId("Purchasing_Document_H").setValueState(sap.ui.core.ValueState.None);
                        this.getView().byId("Purchasing_Document_H").setValueStateText("");
                        this.getView().byId("GatePass_Type_H").setValueState(sap.ui.core.ValueState.None);
                        this.getView().byId("GatePass_Type_H").setValueStateText("");

                        // ------------------------------

                        var oFilter = new sap.ui.model.Filter("PurchaseOrder", sap.ui.model.FilterOperator.EQ, Purchasing_Document_H);

                        var oTable = this.byId("persoTable");
                        var oModel = this.getView().getModel("YY1_PURCHASE_DOC_ITEMS_CDS"); // Replace with your actual OData model name
                        
                        var oFilters = [oFilter];
                        
                        oModel.read("/YY1_Purchase_Doc_Items", {
                            filters: oFilters,
                            success: function(oData) {
                                var aItems = oData.results; // The array of read items
                        
                                // Create a JSON model and set the data
                                var oTableModel = new sap.ui.model.json.JSONModel();
                                oTableModel.setData({ items: aItems });
                        
                                // Set the model on the table and bind the rows
                                oTable.setModel(oTableModel);
                                oTable.bindRows("/items");
                            },
                            error: function(oError) {
                                // Handle error
                                console.error("Error reading data: ", oError);
                            }
                        });
                        
                        

                        console.log(oModel);

                    }else{
                        this.getView().byId("persoTable").setVisible(false);
                        this.getView().byId("Final_Save_Button").setEnabled(false);
                    }
                },
                
                OnVendorFetch:function(oEvent){
                    let Dataa = this.getView().byId("Vendor_H").getValue();
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
                
                OnPartnerDocNoFetch:function(oEvent){
                    let Dataa = this.getView().byId("Invoice_No_H").getValue();
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


                OnDisplayPage : function(oEvent){

                    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			        oRouter.navTo("header_gatepass_report");
                },

                OnEditPage:function(oEvent){
                    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			        oRouter.navTo("edit_general_purchase");
                },

                // OnDisplayPage:function(oEvent){
                //     var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			    //     oRouter.navTo("display");
                // },
                
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
                   let Purchasing_Document = this.getView().byId("Purchasing_Document_H").getValue();
                   let Vendor_Code = this.getView().byId("Vendor_H").getValue();
                   let Vendor_Name = this.getView().byId("Vendor_Name_H").getValue();
                   let Invoice_No = this.getView().byId("Invoice_No_H").getValue();
                   let No_Of_Packages = this.getView().byId("No_Of_Package").getValue();
                   let Vehicle_No = this.getView().byId("Vehicle_No_H").getValue();
                   let Bins = this.getView().byId("Bin_Select_H").getValue();
                   let No_Of_Bins = this.getView().byId("No_Of_Bins").getValue();
                   let Invoice_Date = this.getView().byId("Invoice_Date_H").getValue();
                   let Transporter = this.getView().byId("Transporter").getValue();
                   let EWayBill = this.getView().byId("E_Way_Bill").getValue();
                   let Business_User_Name = this.getView().byId("Business_User_Name").getValue();
                   let Business_User_ID = this.getView().byId("Business_User_ID").getValue();

                console.log(Id);
                console.log(Gate_Pass_Type);
                console.log(Plant);
                console.log(Purchasing_Document);
                console.log(Vendor_Code);
                console.log(Vendor_Name);
                console.log(Invoice_No);
                console.log(No_Of_Packages);
                console.log(Vehicle_No);
                console.log(Bins);
                console.log(No_Of_Bins);
                console.log(Invoice_Date);
                console.log(Transporter);
                console.log(EWayBill);
                console.log(Business_User_Name);
                console.log(Business_User_ID);


                var Purchasing_Document_Item = []
                var Purchasing_Document_I = []
                var Quantity = []
                var Gate_Entry_Received = []
                var GR_Received_Quantity = []
                var Gate_Pending_Quantity = []
                var Gate_Quantity_To_Post = []
                var UOM = []
                var HSN_Code = []
                var GST_No = []
                var Net_Price = []
                var Material_Code = []
                var Material_Description = []
                var Plant_I = []
                var No_Of_Packages_I = []
                var Vehicle_No_I = []
                var Bins_I = []
                var No_Of_Bins_I = []
                var Invoice_Date_I = []
                var Transporter_I = []
                var EWayBill_I = []

				var Table_Id = this.getView().byId("persoTable"); // Assuming 'persoTable' is the ID of the Grid Table
                var oModel = Table_Id.getModel();
                var Table_Length = Table_Id.getRows().length;

                var itemData = [];

                for (var i = 0; i < Table_Length; i++) {
                    var oRow = Table_Id.getRows()[i];
                    var oBindingContext = oRow.getBindingContext();
                    if (oBindingContext) {
                        var Purchasing_Document_Item = oBindingContext.getProperty("PurchaseOrderItem");
                        var Purchasing_Document_I = oBindingContext.getProperty("PurchaseOrder");
                        var Quantity = oBindingContext.getProperty("OrderQuantity");
                        var Gate_Entry_Received = oBindingContext.getProperty("GateEntryReceived");
                        var GR_Received_Quantity = oBindingContext.getProperty("GRReceivedQuantity");
                        var Gate_Pending_Quantity = oBindingContext.getProperty("GatePendingQuantity");
                        var Gate_Quantity_To_Post_get = oBindingContext.getProperty("QuantityToPostInputLine");
                        if (Gate_Quantity_To_Post_get === undefined || Gate_Quantity_To_Post_get === null || Gate_Quantity_To_Post_get === "") {
                            var Gate_Quantity_To_Post = "0";
                        } else {
                            var Gate_Quantity_To_Post = Gate_Quantity_To_Post_get;                        }
                        var UOM = oBindingContext.getProperty("PurchaseOrderQuantityUnit");
                        var HSN_Code = oBindingContext.getProperty("ConsumptionTaxCtrlCode");
                        var GST_No = oBindingContext.getProperty("GST_No");
                        var Net_Price = oBindingContext.getProperty("NetPriceAmount");
                        var Material_Code = oBindingContext.getProperty("Material");
                        var Material_Description = oBindingContext.getProperty("ProductName");

                        itemData.push({
                            Id: Id,
                            Purchasing_Document_Item: Purchasing_Document_Item,
                            Purchasing_Document:Purchasing_Document_I,
                            Quantity:Quantity,
                            Gate_Entry_Received:Gate_Entry_Received,
                            GR_Received_Quantity:GR_Received_Quantity,
                            Gate_Pending_Quantity:Gate_Pending_Quantity,
                            Gate_Quantity_To_Post:Gate_Quantity_To_Post,
                            UOM:UOM,
                            HSN_Code:HSN_Code,
                            GST_No:GST_No,
                            Net_Price:Net_Price,
                            Material_Code:Material_Code,
                            Material_Description:Material_Description,
                            Plant:Plant,
                            Vendor_Code:Vendor_Code,
                            Vendor_Name:Vendor_Name,
                            No_Of_Packages:No_Of_Packages,
                            Vehicle_No:Vehicle_No,
                            Bins:Bins,
                            No_Of_Bins:No_Of_Bins,
                            Invoice_Date:Invoice_No,
                            Transporter:Transporter,
                            EWayBill:EWayBill,
                            Partner_Document_No:Invoice_No,
                            Po_Created_Date:"",
                            Po_Created_Time:"",
                            Po_Created_Time:"",
                            Field1:"",
                            Field2:"",
                            Field3:"",
                            Field4:"",
                            Field5:"",
                            Posting_Date:null,
                            approve_status:"pending",
                            approve_person_name:Business_User_Name,
                            approve_person_id:Business_User_ID,
                            approve_date:null

                        });
                    }
                }
                            console.log(itemData);

                            var oEntry = {};

                            oEntry.Id=Id;
                            oEntry.SAP_Description="";
                            oEntry.Gate_Pass_Type=Gate_Pass_Type;
                            oEntry.Purchasing_Document=Purchasing_Document;
                            oEntry.Plant=Plant;
                            oEntry.Vendor_Code=Vendor_Code;
                            oEntry.Vendor_Name=Vendor_Name;
                            oEntry.No_Of_Packages=No_Of_Packages;
                            oEntry.Vehicle_No=Vehicle_No;
                            oEntry.Bins=Bins;
                            oEntry.Invoice_No=Invoice_No;
                            oEntry.No_Of_Bins=No_Of_Bins;
                            oEntry.Invoice_Date=Invoice_Date;
                            oEntry.Transporter=Transporter;
                            oEntry.EWayBill=EWayBill;
                            oEntry.Field1="";
                            oEntry.Field2="";
                            oEntry.Field3="";
                            oEntry.Field4="";
                            oEntry.Field5="";
                            oEntry.Posting_Date=null;
                            oEntry.approve_status="pending";
                            oEntry.approve_person_name=Business_User_Name;
                            oEntry.approve_person_id=Business_User_ID;
                            oEntry.approve_date=null;

                            oEntry.to_To_Item = itemData;
                            this.getView().setModel();
                            var oModel = this.getOwnerComponent().getModel("YY1_GENERAL_PURCHASE_CDS");

                            var that = this;

                            oModel.create("/YY1_GENERAL_PURCHASE", oEntry, {
                                success: function (oData, oResponse) {
                                    9
                                    oModel.refresh(true);
                                    MessageBox.success("Document No " + Id + " Generated", {
                                        title: "General Purchase",
                                        id: "messageBoxId1",
                                        contentWidth: "100px",
                                    });

                                    // ==================================================

                                    var oEntry = {};
                                    oEntry.ID=Id;
                                    oEntry.Plant=Plant;
                                    oEntry.Plant_Name="";
                                    oEntry.approve_status="pending";
                                    oEntry.approve_person_name=Business_User_Name;
                                    oEntry.approve_person_id=Business_User_ID;
                                    oEntry.approve_date=null;
                                    oEntry.GatePassId="10002";
                                    oEntry.GatePassName="Gerenal Purchase";

                                    var oModel001 = that.getOwnerComponent().getModel("YY1_GATEPASS_ALL_DATA_CDS");

                                    oModel001.create("/YY1_GATEPASS_ALL_DATA", oEntry, {
                                        success: function (oData, oResponse) {        
                                        }
                                    });  

                                    // ==================================================

                                    that.getView().byId("Id").setValue("");
                                    that.getView().byId("GatePass_Type_H").setValue("RGP");
                                    that.getView().byId("Plant_H").setValue("");
                                    that.getView().byId("Purchasing_Document_H").setValue("");
                                    that.getView().byId("Vendor_H").setValue("");
                                    that.getView().byId("Vendor_Name_H").setValue("");
                                    that.getView().byId("Invoice_No_H").setValue("");
                                    that.getView().byId("No_Of_Package").setValue("");
                                    that.getView().byId("Vehicle_No_H").setValue("");
                                    that.getView().byId("Bin_Select_H").setValue("");
                                    that.getView().byId("No_Of_Bins").setValue("");
                                    that.getView().byId("Transporter").setValue("");
                                    that.getView().byId("E_Way_Bill").setValue("");
                                    that.getView().byId("Business_User_Name").setValue("");
                                    that.getView().byId("Business_User_ID").setValue("");
                                    that.getView().byId("Approve_Status").setSelectedKey("");
                                    that.getView().byId("Approve_Status").setSelectedItem("");
        
                                    that.getOwnerComponent().getModel("YY1_GENERAL_PURCHASE_CDS").read("/YY1_GENERAL_PURCHASE/$count", { /* Decalure Globally in the Create table Serial Number */
                                    success: $.proxy(function (oEvent, oResponse) {
                                        let Count = Number(oResponse.body) + 1; // This should be a number, no need to use Number()
                                        let CountLen = Count.toString(); // Convert to string to get its length
                                        let AddData = "10002";
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
        
                                    that.getView().byId("persoTable").setVisible(false);
                                    that.getView().byId("Final_Save_Button").setEnabled(false);
                                    
                                   
                                }
                            });  
                            
                           
                                    
                        },

        });
    });
