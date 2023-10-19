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

        return Controller.extend("gatepass.controller.inword.inword_sto.inword_sto", {
            onInit: function () {

            this.getOwnerComponent().getModel("YY1_INWORD_STO_CDS").read("/YY1_INWORD_STO/$count", { /* Decalure Globally in the Create table Serial Number */
            success: $.proxy(function (oEvent, oResponse) {
                let Count = Number(oResponse.body) + 1; // This should be a number, no need to use Number()
                let CountLen = Count.toString(); // Convert to string to get its length
                let AddData = "10005";
                let Data = 5 - CountLen.length;
                let CountArray = "";
                for (let i = 0; i < Data; i++) {
                    CountArray += "0";
                }
                console.log(AddData + CountArray + Count); // Concatenate strings correctly
                let LastId = AddData + CountArray + Count;
                this.getView().byId("IdSTO").setValue(LastId);
            }, this)
            });
        },



        OnBack:function(oEvent){
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("View1");
        },

        OnDisplayPage : function(oEvent){

            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("header_gatepass_report");
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


            OnEditPage:function(oEvent){          
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("edit_inword_sto");
            },


            OnOutBoDelFragOpen:function(){
                if (!this._dialog_outbodelhead) {
                    this._dialog_outbodelhead = sap.ui.xmlfragment(this.getView().getId("Outbound_Delivery_dialog"), "gatepass.view.fragments.OutboundDelivery_Head", this);
                    this.getView().addDependent(this._dialog_outbodelhead);
                }
    
                this._dialog_outbodelhead.open();
            },

            OnOutBoDelFragSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter("OutboundDelivery", FilterOperator.Contains, sValue);
                var oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter([oFilter]);
            },

            OnOutBoDelFragSelect : function (oEvent) {
                var oBinding = oEvent.getSource().getBinding("items");
                    oBinding.filter([]);

                var aContexts = oEvent.getParameter("selectedContexts");
                console.log(aContexts)
                var OutboundDelivery, ShipToParty, ShipToPartyName;

                if (aContexts && aContexts.length) {

                    aContexts.map(function (oContext) {
                        OutboundDelivery = oContext.getObject().OutboundDelivery;
                        ShipToParty = oContext.getObject().ShipToParty;
                        ShipToPartyName = oContext.getObject().CustomerName;
                       
                        // plant = oContext.getObject().PurchaseOrder;
                        return;
                    });
                    this.getView().byId("Inbound_Delivery_No_H").setValue(OutboundDelivery);
                    this.getView().byId("Ship_To_Party_H").setValue(ShipToParty);
                    this.getView().byId("Ship_To_Party_Name_H").setValue(ShipToPartyName);
                }
                
                               

                
                //Table binding
                
                
                
               


            },

            OnCustomerFetch:function(oEvent){
                let Dataa = this.getView().byId("Ship_To_Party_Name_H").getValue();
                var data = new Promise(function (resolve) {
    
                    let Dataa1 = Dataa;
                    
                    resolve(Dataa1);
                    });
                return data;
            },
                  


            onVechileEnter:function(){
                let getValue = this.getView().byId("idvech_sto").getValue();
                let oTable =  this.getView().byId("salessto")
                let OTable_Len = oTable.getRows();  
                
                for (let i=0; i < OTable_Len.length; i++){
                    oTable.getRows()[i].getCells()[13].setValue(getValue);
                }


            },


            onTransportEnter:function(){
                let getValue = this.getView().byId("idtrans_sto").getValue();
                let oTable =  this.getView().byId("salessto")
                let OTable_Len = oTable.getRows();  
                
                for (let i=0; i < OTable_Len.length; i++){
                    oTable.getRows()[i].getCells()[14].setValue(getValue);
                }
            },




           
            

        
            OnCustomerNameFetch:function(oEvent){
                let Dataa = this.getView().byId("Ship_To_Party_H").getValue();
                var data = new Promise(function (resolve) {
    
                    let Dataa1 = Dataa;
                    
                    resolve(Dataa1);
                    });
                return data;
            },
                 


            On_Go_Button:function(oEvent){

                var Inbound_Delivery_H = this.getView().byId("Inbound_Delivery_No_H").getValue();
                var Vechicle_No = this.getView().byId("idvech_sto").getValue();
                var GatePass_Type_H = this.getView().byId("GatePass_Type_H").getValue();
                this.getView().byId("Final_Cancel_Button").setEnabled(true);
                   
                if (Inbound_Delivery_H !== "" && GatePass_Type_H !== ""){
                    this.getView().byId("Inbound_Delivery_No_H").setValueState(sap.ui.core.ValueState.None);
                    this.getView().byId("Inbound_Delivery_No_H").setValueStateText("");
                    this.getView().byId("GatePass_Type_H").setValueState(sap.ui.core.ValueState.None);
                    this.getView().byId("GatePass_Type_H").setValueStateText("");

                     this.getView().byId("idveh_sto").setValue("Vechicle_No");

                     this.getView().byId("salessto").setVisible(true);

                    var oFilter = new sap.ui.model.Filter("OutboundDelivery", sap.ui.model.FilterOperator.EQ, Inbound_Delivery_H);
                        var oTable = this.getView().byId("salessto");
                        var oModel = this.getView().getModel("YY1_OUTBOUND_DELIVERY_ITEM_CDS"); // Replace with your actual OData model name
                       
                        var oFilters = [oFilter];


                        oModel.read("/YY1_Outbound_Delivery_Item", {
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
                        

                }
                else{
                    this.getView().byId("salessto").setVisible(false);
                    this.getView().byId("Final_Save_Button").setEnabled(false);
                }
                //   ---------------------------

                    if(Inbound_Delivery_H == ""){
                        this.getView().byId("Inbound_Delivery_No_H").setValueState(sap.ui.core.ValueState.Error);
                        this.getView().byId("Inbound_Delivery_No_H").setValueStateText("Please Enter Purchase Document No");
                    }else{
                        this.getView().byId("Inbound_Delivery_No_H").setValueState(sap.ui.core.ValueState.None);
                        this.getView().byId("Inbound_Delivery_No_H").setValueStateText("");
                    }
                    
                    if (GatePass_Type_H == "" ){ // Both is equal to empty
                        this.getView().byId("GatePass_Type_H").setValueState(sap.ui.core.ValueState.Error);
                        this.getView().byId("GatePass_Type_H").setValueStateText("Please select any Gate Pass type");
                    }else{                     
                        this.getView().byId("GatePass_Type_H").setValueState(sap.ui.core.ValueState.None);
                        this.getView().byId("GatePass_Type_H").setValueStateText("");
                    }
    

            },


            OnReceivedQtyCal: function(DoItem, OrderQuantity) {

                var that = this; // Store reference to 'this'
                var OrderQuantity = parseFloat(OrderQuantity);
            
                return new Promise(function(resolve, reject) {
        
                    var DelNo = that.getView().byId("Inbound_Delivery_No_H").getValue();
            
                    var oFilter = new sap.ui.model.Filter("Return_Order_Item", sap.ui.model.FilterOperator.EQ, DoItem);
                    var oFilter1 = new sap.ui.model.Filter("Return_Order", sap.ui.model.FilterOperator.EQ, DelNo); 
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



            OnPendingQtyCal: function(DoItem, OrderQuantity) {

                var that = this; // Store reference to 'this'
                    var OrderQuantity = parseFloat(OrderQuantity);
                
                    return new Promise(function(resolve, reject) {
            
                        var DelNo = that.getView().byId("Inbound_Delivery_No_H").getValue();
                        
                        var oFilter = new sap.ui.model.Filter("Return_Order_Item", sap.ui.model.FilterOperator.EQ, DoItem);
                        var oFilter1 = new sap.ui.model.Filter("Return_Order", sap.ui.model.FilterOperator.EQ, DelNo); 
                        var oFilter2 = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, '');
                
                        var oModel001 = that.getView().getModel("YY1_INWORD_STO_CDS");
                        var oFilters001 = [oFilter, oFilter1, oFilter2];
    
                        var CalData = 0;
                
                        oModel001.read("/YY1_ITEMS_INWORD_STO", {
                            filters: oFilters001,
                            success: function(oData) {
                                var aItems = oData.results;
                                console.log(oData)
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


            OnSubmit: function(oEvent){

                // MessageToast.show("The Data Save Successfully...!");
                // ------- Loder Model Boc Open - Enable ----------------
                if (!this._pBusyDialog) {
                    this._pBusyDialog = sap.ui.xmlfragment(this.getView().getId("BusyDialog"), "gatepass.view.fragments.BusyIndicator", this);
                    this.getView().addDependent(this._pBusyDialog);
                }
                this._pBusyDialog.open();
                // ------- Loder Model Boc Open - Enable ----------------
    
               let Id = this.getView().byId("IdSTO").getValue();
               let Gate_Pass_Type = this.getView().byId("GatePass_Type_H").getValue();
               let Delivery_No = this.getView().byId("Inbound_Delivery_No_H").getValue();
               let Customer = this.getView().byId("Ship_To_Party_H").getValue();
               let Customer_Name = this.getView().byId("Ship_To_Party_Name_H").getValue();           
               let Sales_STO_Doc_No = this.getView().byId("IdSTO").getValue();
               let No_Of_Packages = this.getView().byId("idpack_sto").getValue();
               let Vehicle_No = this.getView().byId("idvech_sto").getValue();
               let Bins = this.getView().byId("Bin_Select_H_sto").getValue();
               let No_Of_Bins = this.getView().byId("No_Of_Bins").getValue();
               let Transporter = this.getView().byId("idtrans_sto").getValue();
    
            console.log(Id);
            console.log(Gate_Pass_Type);
            console.log(Delivery_No);
            console.log(Customer);
            console.log(Customer_Name);
            console.log(Sales_STO_Doc_No);
            console.log(No_Of_Packages);
            console.log(Vehicle_No);
            console.log(Bins);
            console.log(No_Of_Bins);
            console.log(Transporter);
          

            var Table_Id = this.getView().byId("salessto"); // Assuming 'persoTable' is the ID of the Grid Table
            var oModel = Table_Id.getModel();
            var Table_Length = Table_Id.getRows().length;
    
            var itemData = [];
    
            for (var i = 0; i < Table_Length; i++) {
                var oRow = Table_Id.getRows()[i];
                var oBindingContext = oRow.getBindingContext();
                if (oBindingContext) {
                    var Delivery_Item = Table_Id.getRows()[i].getCells()[0].getValue()
                    var Quantity = Table_Id.getRows()[i].getCells()[2].getValue()
                    var UOM = Table_Id.getRows()[i].getCells()[3].getValue()
                    var Pending_Quantity = Table_Id.getRows()[i].getCells()[5].getValue()
                    var Received_Quantity = Table_Id.getRows()[i].getCells()[4].getValue()
                    var Quantity_To_Post = Table_Id.getRows()[i].getCells()[6].getValue()
                    var Material = Table_Id.getRows()[i].getCells()[7].getValue()
                    var Material_description = Table_Id.getRows()[i].getCells()[8].getValue()
                    var Plant = Table_Id.getRows()[i].getCells()[9].getValue()
                    var Plant_Name = Table_Id.getRows()[i].getCells()[10].getValue()
                    
    
                    var Quantity_To_Post = Table_Id.getRows()[i].getCells()[6].getValue()
                    if (Quantity_To_Post === undefined || Quantity_To_Post === null || Quantity_To_Post === "") {
                        var Quantity_To_Post = "0";
                    } else {
                        var Quantity_To_Post = Quantity_To_Post;                        }
    
                    itemData.push({
                        
                        Id:Id,
                        Return_Order_Item:Delivery_Item,
                        Return_Order:Delivery_No,
                        Material:Material,
                        Quantity:Quantity,
                        Material_Description:Material_description,
                        Received_Quantity:Received_Quantity,
                        Pending_Quantity:Pending_Quantity,
                        Quantity_To_Post:Quantity_To_Post,
                        Plant:Plant,
                        Plant_Name:Plant_Name,
                        Customer_Code:Customer,
                        Customer_Name:Customer_Name,
                        No_Of_Packages:No_Of_Packages,
                        Vehicle_No:Vehicle_No,
                        Bins:Bins,
                        No_Of_Bins:No_Of_Bins,
                        Transporter:Transporter,
                        Gate_Entry_Type:Gate_Pass_Type,
                        Customer_Doc_No:Sales_STO_Doc_No,
                        Status:"",
                        Status01:"",
                        Field01:"",
                        Field02:"",
                        Field03:"",
                        Field04:"",
                        Field05:"",
                        
                    });
                }
            }


            console.log(itemData);

            var oEntry = {};

            oEntry.Id = Id;
            oEntry.ReturnOrder = Delivery_Item;
            oEntry.Gate_Entry_Type=Gate_Pass_Type
            oEntry.Customer_Code = Customer;
            oEntry.Customer_Name = Customer_Name;
            oEntry.Plant = Plant;
            oEntry.Plant_Name=Plant_Name;
            oEntry.No_Of_Packages = No_Of_Packages;
            oEntry.Vehicle_No = Vehicle_No;
            oEntry.Bins = Bins;
            oEntry.Customer_Doc_No = Sales_STO_Doc_No;
            oEntry.No_Of_Bins = No_Of_Bins;
            oEntry.Transporter = Transporter;
            oEntry.Status = "";
            oEntry.Status01 = "";
            oEntry.Field01 = "";
            oEntry.Field02 = "";
            oEntry.Field03 = "";
            oEntry.Field04 = "";
            oEntry.Field05 = "";

            oEntry.to_ITEMS = itemData;
            this.getView().setModel();
            var oModel = this.getOwnerComponent().getModel("YY1_INWORD_STO_CDS");

            var that = this;

            oModel.create("/YY1_INWORD_STO", oEntry, {
                success: function (oData, oResponse) {

                    that._pBusyDialog.close();
                    MessageToast.show(""+Id+" Created Successfully")        
                    oModel.refresh(true);
                    MessageBox.success("Document No " + Id + " Generated", {
                        title: "STO Goods Receipt",
                        id: "messageBoxId1",
                        contentWidth: "100px",
                    });

                    that.getView().byId("IdSTO").setValue("");
                    that.getView().byId("GatePass_Type_H").setValue("");
                    that.getView().byId("Inbound_Delivery_No_H").setValue("");
                    that.getView().byId("Ship_To_Party_H").setValue("");
                    that.getView().byId("Ship_To_Party_Name_H").setValue("");           
                    that.getView().byId("IdSTO").setValue("");
                    that.getView().byId("idpack_sto").setValue("");
                    that.getView().byId("idvech_sto").setValue("");
                    that.getView().byId("Bin_Select_H_sto").setValue("");
                    that.getView().byId("No_Of_Bins").setValue("");
                    that.getView().byId("idtrans_sto").setValue("");

                    that.getOwnerComponent().getModel("YY1_INWORD_STO_CDS").read("/YY1_INWORD_STO/$count", { /* Decalure Globally in the Create table Serial Number */
                    success: $.proxy(function (oEvent, oResponse) {
                        let Count = Number(oResponse.body) + 1; // This should be a number, no need to use Number()
                        let CountLen = Count.toString(); // Convert to string to get its length
                        let AddData = "10005";
                        let Data = 5 - CountLen.length;
                        let CountArray = "";
                        for (let i = 0; i < Data; i++) {
                            CountArray += "0";
                        }
                        console.log(AddData + CountArray + Count); // Concatenate strings correctly
                        let LastId = AddData + CountArray + Count;
                        that.getView().byId("IdSTO").setValue(LastId);
                    }, that)
                    });

                    that.getView().byId("salessto").setVisible(false);
                    that.getView().byId("Final_Save_Button").setEnabled(false);
                }
            });
 
            }, 
            
            
       
        });
    });
