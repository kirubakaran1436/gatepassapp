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

        return Controller.extend("gatepass.controller.outword.Subcontracting_Vendor.Subcontracting_Vendor", {
            onInit: function () {
                this.getOwnerComponent().getModel("YY1_SUBCONTRACTING_VENDOR_CDS").read("/YY1_SUBCONTRACTING_VENDOR/$count", { /* Decalure Globally in the Create table Serial Number */
                success: $.proxy(function (oEvent, oResponse) {
                    let Count = Number(oResponse.body) + 1; // This should be a number, no need to use Number()
                    let CountLen = Count.toString(); // Convert to string to get its length
                    let AddData = "20004";
                    let Data = 5 - CountLen.length;
                    let CountArray = "";
                    for (let i = 0; i < Data; i++) {
                        CountArray += "0";
                    }
                    console.log(AddData + CountArray + Count); // Concatenate strings correctly
                    let LastId = AddData + CountArray + Count;
                    this.getView().byId("IdRetChalNo").setValue(LastId);
                }, this)
                });
            
            },

            OnMatDocDateChange:function(){
                let Mat_Doc_Date = this.getView().byId("DP11").getValue();
                if(Mat_Doc_Date.trim() !== ""){
                    this.getView().byId("mat_doc_H").setEnabled(true);
                }else{
                    this.getView().byId("mat_doc_H").setEnabled(false);
                }
                
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


            OnBack:function(oEvent){
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    oRouter.navTo("View1");
            },

            OnEditPage:function(oEvent){          
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("Edit_Subcontracting_Vendor");
            },



            On_Go_Button:function(){
                // alert("on clicked");
        
                var MaterialDocument = this.getView().byId("mat_doc_H").getValue();

                var GateEntryType = this.getView().byId("GatePass_Type_H").getValue();

                if (MaterialDocument !== "" && GateEntryType !== "") {

                    this.getView().byId("mat_doc_H").setValueState(sap.ui.core.ValueState.None);
                    this.getView().byId("mat_doc_H").setValueStateText("");
                    this.getView().byId("GatePass_Type_H").setValueState(sap.ui.core.ValueState.None);
                    this.getView().byId("GatePass_Type_H").setValueStateText("");

                     this.getView().byId("Subcontracting_Vendor").setVisible(true);

                    // ------------------------------

                    var oFilter = new sap.ui.model.Filter("MaterialDocument", sap.ui.model.FilterOperator.EQ, MaterialDocument);

                    var oTable = this.byId("Subcontracting_Vendor");
                    var oModel = this.getView().getModel("YY1_OW_RETURNABLE_CLN_ITEM_CDS"); // Replace with your actual OData model name
                    var oFilters = [oFilter];

                    oModel.read("/YY1_OW_Returnable_Cln_Item", {

                        filters: oFilters,

                        success: function (oData) {

                            var aItems = oData.results; // The array of read items

                            // Create a JSON model and set the data

                            var oTableModel = new sap.ui.model.json.JSONModel();

                            oTableModel.setData({ items: aItems });

                            // Set the model on the table and bind the rows

                            oTable.setModel(oTableModel);

                            oTable.bindRows("/items");

                        },

                        error: function (oError) {

                            // Handle error

                            console.error("Error reading data: ", oError);

                        }

                    });

                    // console.log(oModel);

                } 

                else{
                    this.getView().byId("Subcontracting_Vendor").setVisible(false);
                    this.getView().byId("Final_Save_Button").setEnabled(false);
                }
                //   ---------------------------

                    if(MaterialDocument == ""){
                        this.getView().byId("mat_doc_H").setValueState(sap.ui.core.ValueState.Error);
                        this.getView().byId("mat_doc_H").setValueStateText("Please Enter Purchase Document No");
                    }else{
                        this.getView().byId("mat_doc_H").setValueState(sap.ui.core.ValueState.None);
                        this.getView().byId("mat_doc_H").setValueStateText("");
                    }
                    
                    if (GateEntryType == "" ){ // Both is equal to empty
                        this.getView().byId("GatePass_Type_H").setValueState(sap.ui.core.ValueState.Error);
                        this.getView().byId("GatePass_Type_H").setValueStateText("Please select any Gate Pass type");
                    }else{                     
                        this.getView().byId("GatePass_Type_H").setValueState(sap.ui.core.ValueState.None);
                        this.getView().byId("GatePass_Type_H").setValueStateText("");
                    }   

            },

        //    material return fragment 


        OnMaterialDocFragOpen:function(oEvent5){
            let Get_Mat_Doc_Date = this.getView().byId("DP11").getValue();
            // ====================================================================
            var oFilter1 = new sap.ui.model.Filter("MaterialDocumentYear", sap.ui.model.FilterOperator.EQ, Get_Mat_Doc_Date);
                var oFilter2 = new sap.ui.model.Filter("GoodsMovementType", sap.ui.model.FilterOperator.EQ,"541");
                var oModel1 = this.getView().getModel("YY1_OW_RETURNABLE_CLN_ITEM_CDS"); // Replace with your actual OData model name
                var oFilters1 = [oFilter1, oFilter2];
                var that = this;

                oModel1.read("/YY1_OW_Returnable_Cln_Item", {

                    filters: oFilters1,

                    success: function (oData) {

                        var aItems = oData.results; // The array of read items

                        const unique = aItems.filter((obj, index) => {
                            return index === aItems.findIndex(o => obj.MaterialDocument === o.MaterialDocument);
                        });

                        console.log(unique);

                        var oJSONModel = new sap.ui.model.json.JSONModel({
                            data: unique
                        });
                       console.log(oJSONModel);
                        that.getView().setModel(oJSONModel, "JModel");

                    },

                    error: function (oError) {
                        console.error("Error reading data: ", oError);

                    }
                
                })
            // ====================================================================
             
            if (!this._dialog_outbodelhead) {
                this._dialog_outbodelhead = sap.ui.xmlfragment(this.getView().getId("MatDoc_dialog"), "gatepass.view.fragments.Material_Document_Head541", this);
                this.getView().addDependent(this._dialog_outbodelhead);
            }

            this._dialog_outbodelhead.open();
                   
        },
             
        OnMatDocSearch: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter("MaterialDocument", FilterOperator.Contains, sValue);
            var oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([oFilter]);
        },

        OnMatDocSelect : function (oEvent) {
        
            var oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter([]);
                var aContexts = oEvent.getParameter("selectedContexts");
                console.log(aContexts)
                var MaterialDocument, MaterialDocumentYear;

                if (aContexts && aContexts.length) {

                    aContexts.map(function (oContext) {

                        MaterialDocument = oContext.getObject().MaterialDocument;

                        MaterialDocumentYear = oContext.getObject().MaterialDocumentYear;

                        return;

                    });

                    this.byId("mat_doc_H").setValue(MaterialDocument);

                    this.byId("DP11").setValue(MaterialDocumentYear);

                }

                var MaterialDocument = this.getView().byId("mat_doc_H").getValue();
                var oFilter1 = new sap.ui.model.Filter("MaterialDocument", sap.ui.model.FilterOperator.EQ, MaterialDocument);
                var oFilter1 = new sap.ui.model.Filter("GoodsMovementType", sap.ui.model.FilterOperator.EQ,"541");
                var oModel1 = this.getView().getModel("YY1_OW_RETURNABLE_CLN_ITEM_CDS"); // Replace with your actual OData model name
                var oFilters1 = [oFilter1];
                var that = this;

                oModel1.read("/YY1_OW_Returnable_Cln_Item", {

                    filters: oFilters1,

                    success: function (oData) {

                        var aItems = oData.results; // The array of read items
                        let lant_H = aItems[0].Plant;
                        let Vendor = aItems[0].Supplier;
                        let VendorName = aItems[0].SupplierName;
                        that.getView().byId("plant_H").setValue(lant_H);
                        that.getView().byId("idretvend").setValue(Vendor);
                      that.getView().byId("idretcustname").setValue(VendorName);

                    },

                    error: function (oError) {

                        // Handle error

                        console.error("Error reading data: ", oError);

                    }
                
                })
                        
            
            //Table binding

        },




        OnReceivedQtyCal: function(DoItem, OrderQuantity) {

            var that = this; // Store reference to 'this'
            var OrderQuantity = parseFloat(OrderQuantity);
        
            return new Promise(function(resolve, reject) {
    
                var DelNo = that.getView().byId("mat_doc_H").getValue();
                
                var oFilter = new sap.ui.model.Filter("Material_Document_Item", sap.ui.model.FilterOperator.EQ, DoItem);
                var oFilter1 = new sap.ui.model.Filter("Material_Document_Number", sap.ui.model.FilterOperator.EQ, DelNo); 
                var oFilter2 = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, '');
            
                var oModel = that.getView().getModel("YY1_SUBCONTRACTING_VENDOR_CDS");
                var oFilters = [oFilter, oFilter1, oFilter2];

                var CalData = 0;
                
        
                oModel.read("/YY1_ITEMS_SUBCONTRACTING_VENDO", {
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
        
                    var DelNo = that.getView().byId("mat_doc_H").getValue();
                    
            
                    var oFilter = new sap.ui.model.Filter("Material_Document_Item", sap.ui.model.FilterOperator.EQ, DoItem);
                    var oFilter1 = new sap.ui.model.Filter("Material_Document_Number", sap.ui.model.FilterOperator.EQ, DelNo); 
                    var oFilter2 = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, '');
            
                    var oModel001 = that.getView().getModel("YY1_SUBCONTRACTING_VENDOR_CDS");
                    var oFilters001 = [oFilter, oFilter1, oFilter2];

                    var CalData = 0;
            
                    oModel001.read("/YY1_ITEMS_SUBCONTRACTING_VENDO", {
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
            let Quantity_to_Post_Input = oEvent.getSource().getParent().getCells()[7].getValue(); 
            let QuantityLine = oEvent.getSource().getParent().getCells()[4].getValue();
            let Pending_Quantity_Item = oEvent.getSource().getParent().getCells()[6].getValue();

            let Quantity_to_Post_Input_Float = parseFloat(Quantity_to_Post_Input.trim());
            let QuantityLine_Float = parseFloat(QuantityLine.trim());
            let Pending_Quantity_Item_Float = parseFloat(Pending_Quantity_Item.trim());

            if(Quantity_to_Post_Input_Float > Pending_Quantity_Item_Float){
                MessageToast.show("Please Enter Valid Quantity...!");
                oEvent.getSource().getParent().getCells()[7].setValueState(sap.ui.core.ValueState.Error);
                oEvent.getSource().getParent().getCells()[7].setValueStateText("Please Enter Valid Quantity");
                this.getView().byId("Final_Save_Button").setEnabled(false);
                this.getView().byId("Final_Save_Button").setEnabled(false);

            }else if(Quantity_to_Post_Input_Float === "" ){
                oEvent.getSource().getParent().getCells()[7].setValue("0");
                this.getView().byId("Final_Save_Button").setEnabled(false);
                
            }

            else if (Quantity_to_Post_Input_Float <= Pending_Quantity_Item_Float && Quantity_to_Post_Input_Float !== "") {
                oEvent.getSource().getParent().getCells()[7].setValueState(sap.ui.core.ValueState.None);
                // this.getView().byId("OnSubmit").setEnabled(true);

                let A01 = Pending_Quantity_Item_Float - Quantity_to_Post_Input_Float;

                // oEvent.getSource().getParent().getCells()[5].setValue(A01);
                // oEvent.getSource().getParent().getCells()[3].setValue(Quantity_to_Post_Input_Float);

                this.getView().byId("Final_Save_Button").setEnabled(true);

            }

        },


   


        OnNoOfPackageFetch:function(oEvent){
            let Dataa = this.getView().byId("idretnoofpackg").getValue();
            var data = new Promise(function (resolve) {

                let Dataa1 = Dataa;
                
                resolve(Dataa1);
                });
            return data;
        },


        OnVehicleNoFetch:function(oEvent){
            let Dataa = this.getView().byId("idretvehicleno").getValue();
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


        OnCustomerDocFetch: function(oEvent){

            let Dataa = this.getView().byId("idretcustdocno").getValue();
            var data = new Promise(function (resolve) {

                let Dataa1 = Dataa;
                
                resolve(Dataa1);
                });
            return data;
        },


        OnGateEntryFetch: function(oEvent){

            let Dataa = this.getView().byId("GatePass_Type_H").getValue();
            var data = new Promise(function (resolve) {

                let Dataa1 = Dataa;
                
                resolve(Dataa1);
                });
            return data;
        },


        OnBinsFetch: function(oEvent){

            let Dataa = this.getView().byId("idbinyes").getValue();
            var data = new Promise(function (resolve) {

                let Dataa1 = Dataa;
                
                resolve(Dataa1);
                });
            return data;
        },

        oNTransportFetch: function(oEvent){

            let Dataa = this.getView().byId("idrettranport").getValue();
            var data = new Promise(function (resolve) {

                let Dataa1 = Dataa;
                
                resolve(Dataa1);
                });
            return data;
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

           let Id = this.getView().byId("IdRetChalNo").getValue();
          let Material_Document = this.getView().byId("mat_doc_H").getValue();
          let Gate_Entry_Type = this.getView().byId("GatePass_Type_H").getValue();
           let Material_Doc_Year = this.getView().byId("DP11").getValue();
           let Vendor= this.getView().byId("idretvend").getValue();
           let Vendor_Name = this.getView().byId("idretcustname").getValue();           
           let No_Of_Packages = this.getView().byId("idretnoofpackg").getValue();
           let Vehicle_No = this.getView().byId("idretvehicleno").getValue();
           let Bins = this.getView().byId("idbinyes").getValue();
           let No_Of_Bins = this.getView().byId("No_Of_Bins").getValue();
           let Transporter = this.getView().byId("idrettranport").getValue();

        console.log(Id);
        console.log(Gate_Entry_Type);
        console.log(Material_Document);
        console.log(Material_Doc_Year);
        console.log(Vendor);
        console.log(Vendor_Name);
        console.log(No_Of_Packages);
        console.log(Vehicle_No);
        console.log(Bins);
        console.log(No_Of_Bins);
        console.log(Transporter);
      

        var Table_Id = this.getView().byId("Subcontracting_Vendor"); // Assuming 'persoTable' is the ID of the Grid Table
        var oModel = Table_Id.getModel();
        var Table_Length = Table_Id.getRows().length;

        var itemData = [];

        for (var i = 0; i < Table_Length; i++) {
            var oRow = Table_Id.getRows()[i];
            var oBindingContext = oRow.getBindingContext();
            if (oBindingContext) {
                var Material_Document_Item = Table_Id.getRows()[i].getCells()[0].getValue()
                var Material_Document_Number = Table_Id.getRows()[i].getCells()[1].getValue()
                var Quantity = Table_Id.getRows()[i].getCells()[4].getValue()
                var UOM = Table_Id.getRows()[i].getCells()[3].getValue()
                var Pending_Quantity = Table_Id.getRows()[i].getCells()[6].getValue()
                var Received_Quantity = Table_Id.getRows()[i].getCells()[5].getValue()
                var Quantity_To_Post = Table_Id.getRows()[i].getCells()[7].getValue()
                var Plant = Table_Id.getRows()[i].getCells()[8].getValue()
                var Plant_Name = Table_Id.getRows()[i].getCells()[9].getValue()
                var Customer = Table_Id.getRows()[i].getCells()[10].getValue()
                var Customer_Name = Table_Id.getRows()[i].getCells()[11].getValue()
                

                var Quantity_To_Post = Table_Id.getRows()[i].getCells()[7].getValue()
                if (Quantity_To_Post === undefined || Quantity_To_Post === null || Quantity_To_Post === "") {
                    var Quantity_To_Post = "0";
                } else {
                    var Quantity_To_Post = Quantity_To_Post;                        }

                itemData.push({
                    
                    Id:Id,
                    Plant:Plant,
                    Gate_Entry_Type:Gate_Entry_Type,
                    Plant_Name:Plant_Name,
                    Material_Document_Number:Material_Document_Number,
                    Vendor_Code:Vendor,
                    Vendor_Name:Vendor_Name,
                    Material_Document_Year:Material_Doc_Year,
                    Material_Document_Item:Material_Document_Item,
                    Quantity:Quantity,
                    UOM:UOM,
                    No_of_Packages:No_Of_Packages,
                    Vehicle_No:Vehicle_No,
                    Received_Quantity:Received_Quantity,
                    Pending_Quantity:Pending_Quantity,
                    Quantity_To_Post:Quantity_To_Post,
                    Official_Excise_Document:"",
                    InternalExcise_Document_Numb:"",
                    Official_Excise_Document:"",
                    Status:"",
                    Status01:"",
                    Field02:"",
                    Field03:"",
                    Field011:""                                 
                    
                });
            }
        }


        console.log(itemData);

        var oEntry = {};

        oEntry.Id = Id;
        oEntry.Gate_Entry_Type = Gate_Entry_Type;
        oEntry.Plant = Plant;
        oEntry.Plant_Name = Plant_Name;
        oEntry.Material_Document_Number = Material_Document;
        oEntry.Material_Document_year = Material_Doc_Year;
        oEntry.Vendor_Code = Vendor;
        oEntry.Vendor_Name = Vendor_Name;
        oEntry.No_of_Packages = No_Of_Packages;
        oEntry.Vehicle_No = Vehicle_No;
        oEntry.Bins = Bins;
        oEntry.No_of_Bins = No_Of_Bins;
        oEntry.Bin_Challan_No = "";
        oEntry.Transporter = Transporter;
        oEntry.Excise_Doc_Year = "";
        oEntry.Official_Excise_Document = "";
        oEntry.Status = "";
        oEntry.Status01 = "";
        oEntry.Field01 = "";
        oEntry.Field02 = "";
        oEntry.Field03 = "";
        oEntry.Field04 = "";
        oEntry.Posting_Date = "";

        // oEntry.Id = Id;
        // oEntry.Material_Document_Number = Material_Document_Number;
        // oEntry.Gate_Entry_Type=Gate_Entry_Type;
        // oEntry.Vendor_Code = Customer;
        // oEntry.Vendor_Name = Customer_Name;
        // oEntry.Plant = Plant;
        // oEntry.Plant_Name=Plant_Name;
        // oEntry.No_of_Packages = No_Of_Packages;
        // oEntry.Vehicle_No = Vehicle_No;
        // oEntry.Bins = Bins;
        // oEntry.No_of_Bins = No_Of_Bins;
        // oEntry.Transporter = Transporter;
        // oEntry.Official_Excise_Document="",
        // oEntry.Official_Excise_Document='',
        // oEntry.Status="",
        // oEntry.Status01="",
        // oEntry.Field01="",
        // oEntry.Field02="",
        // oEntry.Field03="",
        // oEntry.Field011="",
        // oEntry.Field028=""  


        oEntry.to_Items = itemData;
        this.getView().setModel();
        var oModel = this.getOwnerComponent().getModel("YY1_SUBCONTRACTING_VENDOR_CDS");

        var that = this;

        oModel.create("/YY1_SUBCONTRACTING_VENDOR", oEntry, {
            success: function (oData, oResponse) {

                that._pBusyDialog.close();
                oModel.refresh(true);
                MessageBox.success("Document No " + Id + " Generated", {
                    title: "Outward Suncontracting Goods Issue",
                    id: "messageBoxId1",
                    contentWidth: "100px",
                });

                that.getView().byId("IdRetChalNo").setValue("");
                that.getView().byId("mat_doc_H").setValue("");
                that.getView().byId("GatePass_Type_H").setValue("");
                that.getView().byId("DP11").setValue("");
                that.getView().byId("idretvend").setValue("");
                that.getView().byId("idretcustname").setValue("");           
                that.getView().byId("idretnoofpackg").setValue("");
                that.getView().byId("idretvehicleno").setValue("");
                that.getView().byId("idbinyes").setValue("");
                that.getView().byId("No_Of_Bins").setValue("");
                that.getView().byId("idrettranport").setValue("");

                that.getOwnerComponent().getModel("YY1_SUBCONTRACTING_VENDOR_CDS").read("/YY1_SUBCONTRACTING_VENDOR/$count", { /* Decalure Globally in the Create table Serial Number */
                success: $.proxy(function (oEvent, oResponse) {
                    let Count = Number(oResponse.body) + 1; // This should be a number, no need to use Number()
                    let CountLen = Count.toString(); // Convert to string to get its length
                    let AddData = "20004";
                    let Data = 5 - CountLen.length;
                    let CountArray = "";
                    for (let i = 0; i < Data; i++) {
                        CountArray += "0";
                    }
                    console.log(AddData + CountArray + Count); // Concatenate strings correctly
                    let LastId = AddData + CountArray + Count;
                    that.getView().byId("IdRetChalNo").setValue(LastId);
                }, that)
                });

                that.getView().byId("Subcontracting_Vendor").setVisible(false);
                that.getView().byId("Final_Save_Button").setEnabled(false);

            }
        });

        },           

        });
    });
