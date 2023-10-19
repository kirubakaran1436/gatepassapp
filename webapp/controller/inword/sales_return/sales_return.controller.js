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

        return Controller.extend("gatepass.controller.inword.sales_return.sales_return", {
            onInit: function () {
                this.getOwnerComponent().getModel("YY1_SALES_RETURN_CDS").read("/YY1_SALES_RETURN/$count", { /* Decalure Globally in the Create table Serial Number */
				success: $.proxy(function (oEvent, oResponse) {
                    let Count = Number(oResponse.body) + 1; // This should be a number, no need to use Number()
                    let CountLen = Count.toString(); // Convert to string to get its length
                    let AddData = "10003";
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

            OnBack: function(oEvent){

                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("View1");
            },

            OnEditPage:function(oEvent){
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("edit_sales_return");
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


            OnDisplayPage : function(oEvent){

                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("header_gatepass_report");
            },

            OnSoDocFragOpen:function(oEvent){
                if (!this._dialog_SoDochead) {
                    this._dialog_SoDochead = sap.ui.xmlfragment(this.getView().getId("SoDocHead_dialog"), "gatepass.view.fragments.Sales_Return_Header", this);
                    this.getView().addDependent(this._dialog_SoDochead);
                }
    
                this._dialog_SoDochead.open();
            },

            OnSoDocHeadSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter("CustomerReturn", FilterOperator.Contains, sValue);
                var oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter([oFilter]);
            },

            OnSoDoHeadSelect : function (oEvent) {
                var oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter([]);

                var aContexts = oEvent.getParameter("selectedContexts");
                console.log(aContexts)
                var scode, customer, customer_name;

                if (aContexts && aContexts.length) {

                    aContexts.map(function (oContext) {
                        scode = oContext.getObject().CustomerReturn;
                        customer = oContext.getObject().SoldToParty;
                        customer_name = oContext.getObject().BusinessPartnerName1;
                        return;
                    });
                    this.getView().byId("Sales_Return_H").setValue(scode);
                    this.getView().byId("Customer_H").setValue(customer);
                    this.getView().byId("Customer_Name_H").setValue(customer_name);
                }

                    var Sales_Return_Document_H = this.getView().byId("Sales_Return_H").getValue();
                    var GatePass_Type_H = this.getView().byId("GatePass_Type_H").getValue();

                    // ------------------------------

                    
                    var oFilter1 = new sap.ui.model.Filter("CustomerReturn", sap.ui.model.FilterOperator.EQ, Sales_Return_Document_H);
                    var oModel1 = this.getView().getModel("YY1_RETURN_ORDER_ITEM_CDS"); // Replace with your actual OData model name
                    
                    var oFilters1 = [oFilter1];
                    var that = this;
                    
                    oModel1.read("/YY1_Return_Order_Item", {
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
            
            On_Go_Button:function(){
                var Sales_Return_Document_H = this.getView().byId("Sales_Return_H").getValue();
                var GatePass_Type_H = this.getView().byId("GatePass_Type_H").getValue();

                    if (Sales_Return_Document_H !== "" && GatePass_Type_H !== "" ){
                        this.getView().byId("Sales_Return_H").setValueState(sap.ui.core.ValueState.None);
                        this.getView().byId("Sales_Return_H").setValueStateText("");
                        this.getView().byId("GatePass_Type_H").setValueState(sap.ui.core.ValueState.None);
                        this.getView().byId("GatePass_Type_H").setValueStateText("");

                        var oFilter = new sap.ui.model.Filter("CustomerReturn", sap.ui.model.FilterOperator.EQ, Sales_Return_Document_H);
                        var oTable = this.getView().byId("SalesReturnTable");
                        var oModel = this.getView().getModel("YY1_RETURN_ORDER_ITEM_CDS"); // Replace with your actual OData model name
                        var oFilters = [oFilter];
                        var that=this;
                        oModel.read("/YY1_Return_Order_Item", {
                            filters: oFilters,
                            success: function(oData) {
                                var aItems = oData.results; // The array of read items
                                // Create a JSON model and set the data
                                var oTableModel = new sap.ui.model.json.JSONModel();
                                oTableModel.setData({ items: aItems });
                                // Set the model on the table and bind the rows
                                oTable.setModel(oTableModel);
                                oTable.bindRows("/items");
                                that.getView().byId("SalesReturnTable").setVisible(true);
                            },
                            error: function(oError) {
                                // Handle error
                                console.error("Error reading data: ", oError);
                            }
                        });
                    }
                    else
                    {
                        if(Sales_Return_Document_H === ""){
                            this.getView().byId("Sales_Return_H").setValueState(sap.ui.core.ValueState.Error);
                            this.getView().byId("Sales_Return_H").setValueStateText("Please Enter Sales Return Document No");
                        }else{
                            this.getView().byId("Sales_Return_H").setValueState(sap.ui.core.ValueState.None);
                            this.getView().byId("Sales_Return_H").setValueStateText("");
                        }

                        if(GatePass_Type_H === ""){
                            this.getView().byId("GatePass_Type_H").setValueState(sap.ui.core.ValueState.Error);
                            this.getView().byId("GatePass_Type_H").setValueStateText("Please Select Gate Pass Type");
                        }else{
                            this.getView().byId("GatePass_Type_H").setValueState(sap.ui.core.ValueState.None);
                            this.getView().byId("GatePass_Type_H").setValueStateText("");
                        }
                    }
            },

            Quantity_to_Post_InputyLine:function(oEvent){
                let Quantity_to_Post_Input = oEvent.getSource().getParent().getCells()[6].getValue(); 
                let QuantityLine = oEvent.getSource().getParent().getCells()[2].getValue();
                let Pending_Quantity_Item = oEvent.getSource().getParent().getCells()[5].getValue();

                let Quantity_to_Post_Input_Float = parseFloat(Quantity_to_Post_Input.trim());
                let QuantityLine_Float = parseFloat(QuantityLine.trim());
                let Pending_Quantity_Item_Float = parseFloat(Pending_Quantity_Item.trim());

                if(Quantity_to_Post_Input_Float > Pending_Quantity_Item_Float){
                    MessageToast.show("Please Enter Valid Quantity...!");
                    oEvent.getSource().getParent().getCells()[6].setValueState(sap.ui.core.ValueState.Error);
                    oEvent.getSource().getParent().getCells()[6].setValueStateText("Please Enter Valid Quantity");
                    this.getView().byId("Final_Save_Button").setEnabled(false);
                    this.getView().byId("Final_Save_Button").setEnabled(false);

                }else if(Quantity_to_Post_Input_Float === "" ){
                    oEvent.getSource().getParent().getCells()[6].setValue("0");
                    this.getView().byId("Final_Save_Button").setEnabled(false);
                    
                }

                else if (Quantity_to_Post_Input_Float <= Pending_Quantity_Item_Float && Quantity_to_Post_Input_Float !== "") {
                    oEvent.getSource().getParent().getCells()[6].setValueState(sap.ui.core.ValueState.None);
                    // this.getView().byId("OnSubmit").setEnabled(true);

                    let A01 = Pending_Quantity_Item_Float - Quantity_to_Post_Input_Float;

                    // oEvent.getSource().getParent().getCells()[5].setValue(A01);
                    // oEvent.getSource().getParent().getCells()[3].setValue(Quantity_to_Post_Input_Float);

                    this.getView().byId("Final_Save_Button").setEnabled(true);

                }

            },
               
            OnReceivedQtyCal: function(SoItem, OrderQuantity) {

                var that = this; // Store reference to 'this'
                var OrderQuantity = parseFloat(OrderQuantity);
            
                return new Promise(function(resolve, reject) {
                    var SoNo = that.getView().byId("Sales_Return_H").getValue();
                    var Customer = that.getView().byId("Customer_H").getValue();
                    
            
                    var oFilter = new sap.ui.model.Filter("Sales_Order_Item", sap.ui.model.FilterOperator.EQ, SoItem);
                    var oFilter1 = new sap.ui.model.Filter("Sales_Order", sap.ui.model.FilterOperator.EQ, SoNo);
                    var oFilter2 = new sap.ui.model.Filter("Customer_Code", sap.ui.model.FilterOperator.EQ, Customer);
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
        OnPendingQtyCal: function(SoItem, OrderQuantity) {

            var that = this; // Store reference to 'this'
                var OrderQuantity = parseFloat(OrderQuantity);
            
                return new Promise(function(resolve, reject) {
                    var SoNo = that.getView().byId("Sales_Return_H").getValue();
                    var Customer = that.getView().byId("Customer_H").getValue();
                    
            
                    var oFilter = new sap.ui.model.Filter("Sales_Order_Item", sap.ui.model.FilterOperator.EQ, SoItem);
                    var oFilter1 = new sap.ui.model.Filter("Sales_Order", sap.ui.model.FilterOperator.EQ, SoNo);
                    var oFilter2 = new sap.ui.model.Filter("Customer_Code", sap.ui.model.FilterOperator.EQ, Customer);
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

         OnPutQtyENDB: function(SoItem, OrderQuantity) {

            var that = this; // Store reference to 'this'
            var OrderQuantity = parseFloat(OrderQuantity);
        
            return new Promise(function(resolve, reject) {
                var SoNo = that.getView().byId("Sales_Return_H").getValue();
                var Customer = that.getView().byId("Customer_H").getValue();
                
        
                var oFilter = new sap.ui.model.Filter("Sales_Order_Item", sap.ui.model.FilterOperator.EQ, SoItem);
                var oFilter1 = new sap.ui.model.Filter("Sales_Order", sap.ui.model.FilterOperator.EQ, SoNo);
                var oFilter2 = new sap.ui.model.Filter("Customer_Code", sap.ui.model.FilterOperator.EQ, Customer);
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

        OnCustomerFetch:function(oEvent){
            let Dataa = this.getView().byId("Customer_H").getValue();
            var data = new Promise(function (resolve) {

                let Dataa1 = Dataa;
                
                resolve(Dataa1);
                });
            return data;
        },

        OnCustomerNameFetch:function(oEvent){
            let Dataa = this.getView().byId("Customer_Name_H").getValue();
            var data = new Promise(function (resolve) {

                let Dataa1 = Dataa;
                
                resolve(Dataa1);
                });
            return data;
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
           let Sales_Return = this.getView().byId("Sales_Return_H").getValue();
           let Customer_Code = this.getView().byId("Customer_H").getValue();
           let Customer_Name = this.getView().byId("Customer_Name_H").getValue();
           let Customer_Doc_No = this.getView().byId("Customer_Doc_No").getValue();
           let No_Of_Packages = this.getView().byId("No_Of_Package").getValue();
           let Vehicle_No = this.getView().byId("Vehicle_No_H").getValue();
           let Bins = this.getView().byId("Bin_Select_H").getValue();
           let No_Of_Bins = this.getView().byId("No_Of_Bins").getValue();
           let Transporter = this.getView().byId("Transporter").getValue();

        console.log(Id);
        console.log(Gate_Pass_Type);
        console.log(Plant);
        console.log(Sales_Return);
        console.log(Customer_Code);
        console.log(Customer_Name);
        console.log(Customer_Doc_No);
        console.log(No_Of_Packages);
        console.log(Vehicle_No);
        console.log(Bins);
        console.log(No_Of_Bins);
        console.log(Transporter);

        var Table_Id = this.getView().byId("SalesReturnTable"); // Assuming 'persoTable' is the ID of the Grid Table
        var oModel = Table_Id.getModel();
        var Table_Length = Table_Id.getRows().length;

        var itemData = [];

        for (var i = 0; i < Table_Length; i++) {
            var oRow = Table_Id.getRows()[i];
            var oBindingContext = oRow.getBindingContext();
            if (oBindingContext) {
                var Sales_Order_Item = Table_Id.getRows()[i].getCells()[0].getValue()
                var Sales_Order = Table_Id.getRows()[i].getCells()[1].getValue()
                var Quantity = Table_Id.getRows()[i].getCells()[2].getValue()
                var Gate_Entry_Received = Table_Id.getRows()[i].getCells()[3].getValue()
                var GR_Received_Quantity = Table_Id.getRows()[i].getCells()[4].getValue()
                var Gate_Pending_Quantity = Table_Id.getRows()[i].getCells()[5].getValue()
                var Product = Table_Id.getRows()[i].getCells()[8].getValue()
                var Product_Name = Table_Id.getRows()[i].getCells()[9].getValue()

                var Gate_Quantity_To_Post_get = Table_Id.getRows()[i].getCells()[6].getValue()
                if (Gate_Quantity_To_Post_get === undefined || Gate_Quantity_To_Post_get === null || Gate_Quantity_To_Post_get === "") {
                    var Gate_Quantity_To_Post = "0";
                } else {
                    var Gate_Quantity_To_Post = Gate_Quantity_To_Post_get;                        }

                itemData.push({
                    
                    Id:Id,
                    Sales_Order_Item:Sales_Order_Item,
                    Sales_Order:Sales_Order,
                    Quantity:Quantity,
                    Gate_Entry_Received:Gate_Entry_Received,
                    GR_Received_Quantity:GR_Received_Quantity,
                    Gate_Pending_Quantity:Gate_Pending_Quantity,
                    Gate_Quantity_To_Post:Gate_Quantity_To_Post,
                    Plant:Plant,
                    Customer_Code:Customer_Code,
                    Customer_Name:Customer_Name,
                    Product:Product,
                    Product_Name:Product_Name,
                    No_Of_Packages:No_Of_Packages,
                    Vehicle_No:Vehicle_No,
                    Bins:Bins,
                    No_Of_Bins:No_Of_Bins,
                    User_Name:"",
                    Transporter:Transporter,
                    Status:"",
                    Status01:"",
                    Created_Date:"",
                    Created_Time:"",
                    Created_By:"",
                    Changed_On:"",
                    Changed_By:"",
                    Field1:"",
                    Field2:"",
                    Field3:"",
                    Field4:"",
                    Field5:"",

                });
            }
        }
                    console.log(itemData);

                    var oEntry = {};

                    oEntry.Id = Id;
                    oEntry.Gate_Entry_Type = Gate_Pass_Type;
                    oEntry.Return_Sales_Order = Sales_Return;
                    oEntry.Customer_Code = Customer_Code;
                    oEntry.Customer_Name = Customer_Name;
                    oEntry.Plant = Plant;
                    oEntry.No_Of_Packages = No_Of_Packages;
                    oEntry.Vehicle_No = Vehicle_No;
                    oEntry.Bins = Bins;
                    oEntry.No_Of_Bins = No_Of_Bins;
                    oEntry.Customer_Doc_No = Customer_Doc_No;
                    oEntry.Transporter = Transporter;
                    oEntry.Status = "";
                    oEntry.Status01 = "";
                    oEntry.Field1 = "";
                    oEntry.Field2 = "";
                    oEntry.FIeld3 = "";

                    oEntry.to_Item = itemData;
                    this.getView().setModel();
                    var oModel = this.getOwnerComponent().getModel("YY1_SALES_RETURN_CDS");

                    var that = this;

                    oModel.create("/YY1_SALES_RETURN", oEntry, {
                        success: function (oData, oResponse) {

                            that._pBusyDialog.close();
                            oModel.refresh(true);
                             MessageBox.success("Document No " + Id + " Generated", {
                                        title: "Sales Return",
                                        id: "messageBoxId1",
                                        contentWidth: "100px",
                                    });

                                    that.getView().byId("Id").setValue("");
                                    that.getView().byId("GatePass_Type_H").setValue("");
                                    that.getView().byId("Plant_H").setValue("");
                                    that.getView().byId("Sales_Return_H").setValue("");
                                    that.getView().byId("Customer_H").setValue("");
                                    that.getView().byId("Customer_Name_H").setValue("");
                                    that.getView().byId("Customer_Doc_No").setValue("");
                                    that.getView().byId("No_Of_Package").setValue("");
                                    that.getView().byId("Vehicle_No_H").setValue("");
                                    that.getView().byId("Bin_Select_H").setValue("");
                                    that.getView().byId("No_Of_Bins").setValue("");
                                    that.getView().byId("Transporter").setValue("");

                                    that.getOwnerComponent().getModel("YY1_SALES_RETURN_CDS").read("/YY1_SALES_RETURN/$count", { /* Decalure Globally in the Create table Serial Number */
                                    success: $.proxy(function (oEvent, oResponse) {
                                        let Count = Number(oResponse.body) + 1; // This should be a number, no need to use Number()
                                        let CountLen = Count.toString(); // Convert to string to get its length
                                        let AddData = "10003";
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

                                    that.getView().byId("SalesReturnTable").setVisible(false);
                                    that.getView().byId("Final_Save_Button").setEnabled(false);
                        }
                    });

                    
                            
                },


        });
    });
