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
    // For Page Navigation

    function (Controller, MessageBox, MessageToast, Fragment, Filter, FilterOperator, JSONModel, UI5Date) {
        "use strict";

        return Controller.extend("gatepass.controller.report.header_gatepass_report", {
            onInit: function () {
                
                this.Select_Key = "";
            },

            // OnGoItemPage:function(){
            //     var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			//         oRouter.navTo("item_gatepass_report");
            // },

            OnBack:function(){
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			        oRouter.navTo("View1");
            },

                    
        OnPlantFragOpen:function(oEvent){
            if (!this._dialog_planthead) {
                this._dialog_planthead = sap.ui.xmlfragment(this.getView().getId("Plant_dialog"), "gatepass.view.fragments.Plant", this);
                this.getView().addDependent(this._dialog_planthead);
            }

            this._dialog_planthead.open();
        },

        OnPlantSearch: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter("Plant", FilterOperator.Contains, sValue);
            var oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([oFilter]);
        },

        OnPlantSelect : function (oEvent) {
            var oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([]);

            var aContexts = oEvent.getParameter("selectedContexts");
            console.log(aContexts)
            var Plant, Plant_Name;

            if (aContexts && aContexts.length) {

                aContexts.map(function (oContext) {
                    Plant = oContext.getObject().Plant;
                    Plant_Name = oContext.getObject().PlantName;
                    return;
                });
                this.byId("Plant_H").setValue(Plant);
                this.byId("Plant_Name_H").setText(Plant_Name);
            }

        },

        select_i_o:function(oEvent){ 
            let Selected_Options = oEvent.oSource.getSelectedItem().getText();
            let Selected_Options_Key = oEvent.oSource.getSelectedItem().getKey();
            if (Selected_Options === "Inword"){

                var mModel = new sap.ui.model.json.JSONModel({
                    Samples : [
                    {key:"0",text:"General_Purchase"},
                    {key:"1",text:"Cash_Purchase"},
                    {key:"2",text:"Sales_Return"},
                    {key:"3",text:"Subcontracting Goods Receipt"},
                    // {key:"4",text:"Customer"},
                    // {key:"5",text:"Supplying Plant"},
                    // {key:"6",text:"Vendor"},
                    {key:"7",text:"STP Goods Receipt"},
                    // {key:"8",text:"STO Returns"}
                    ]	
                    });
            this.getView().setModel(mModel, "mModel");

            this.getView().byId("I_O_combobox").setPlaceholder("Select Inword");
            this.getView().byId("I_O_combobox").setValue("");
            this.Select_Key = "";
            }

            if ( Selected_Options === "Outword"){

                var mModel = new sap.ui.model.json.JSONModel({
                    Samples : [
                    {key:"9",text:"Vendor Return"},
                    // {key:"10",text:"Returnable Challan"},
                    {key:"11",text:"Subcontractiong Goods Issue"},
                    {key:"12",text:"Sales/STO"},
                    // {key:"13",text:"Unprocessed Loan Material"},
                    // {key:"14",text:"Non Returnable Challan"},
                    ]	
                    });
            this.getView().setModel(mModel, "mModel");
            this.getView().byId("I_O_combobox").setPlaceholder("Select Outword");
            this.getView().byId("I_O_combobox").setValue("");
            this.Select_Key = "";
            }
            
        },

        InSelect_Combo:function(oEvent){
            var KeyData = this.getView().byId("Id_I_O").getValue();
            var GetIOData = this.getView().byId("I_O_combobox").getValue();
            var GetIODataKey = this.getView().byId("I_O_combobox").getSelectedKey();
            this.getView().byId("Gate_Pass_No_H").setValue("");
            this.getView().byId("Gate_Pass_No_H").setPlaceholder(""+GetIOData+" Document No");
            this.getView().byId("Gate_Pass_No_H").setVisible(true);
            this.getView().byId("Lebel_Gate_Pass_No_H").setVisible(true);
            this.getView().byId("Lebel_Enter_Gate_Pass_No_H").setVisible(false);
            this.getView().byId("Enter_Gate_Pass_No_H").setVisible(false);
            this.getView().byId("Enter_Gate_Pass_No_H").setValue("");

            if(this.getView().byId("I_O_combobox").getValue() === "" && this.getView().byId("Enter_Gate_Pass_No_H").getValue() === ""){
                this.getView().byId("Go_Button").setEnabled(false);
            }else{
                this.getView().byId("Go_Button").setEnabled(true);
            }

        },

        OnGataPassNoFragment:function(){
            var KeyData = this.getView().byId("Id_I_O").getValue();
            var GetIOData = this.getView().byId("I_O_combobox").getValue();
            var GetIODataKey = this.getView().byId("I_O_combobox").getSelectedKey();
            

            if(KeyData === "Inword"){ //-------- Inword Function -----------------//
                if(GetIODataKey === "0"){ //----- If Select "General Purchase" -------//
                    if (!this._dialog_GenPurDocNo) {
                        this._dialog_GenPurDocNo = sap.ui.xmlfragment(this.getView().getId("GenPurDocNo_dialog"), "gatepass.view.fragments.reports.General_Purchase_Doc_No", this);
                        this.getView().addDependent(this._dialog_GenPurDocNo);
                    }
                    this._dialog_GenPurDocNo.open();
                }else if(GetIODataKey === "1"){
                    if (!this._dialog_CashPurDocNo) {
                        this._dialog_CashPurDocNo = sap.ui.xmlfragment(this.getView().getId("GenCashDocNo_dialog"), "gatepass.view.fragments.reports.Cash_Purchase_Doc_No", this);
                        this.getView().addDependent(this._dialog_CashPurDocNo);
                    }
                    this._dialog_CashPurDocNo.open();
                }
                else if(GetIODataKey === "2"){
                    if (!this._dialog_SalesRetDocNo) {
                        this._dialog_SalesRetDocNo = sap.ui.xmlfragment(this.getView().getId("GenSaleDocNo_dialog"), "gatepass.view.fragments.reports.Sales_Return_Doc_No", this);
                        this.getView().addDependent(this._dialog_SalesRetDocNo);
                    }
                    this._dialog_SalesRetDocNo.open();
                }
                else if(GetIODataKey === "3"){
                    if (!this._dialog_03) {
                        this._dialog_03 = sap.ui.xmlfragment(this.getView().getId("INRtnCln_dialog"), "gatepass.view.fragments.reports.IN_Returnable_Challan_Head", this);
                        this.getView().addDependent(this._dialog_03);
                    }
                    this._dialog_03.open();
                }
                else if(GetIODataKey === "7"){
                    if (!this._dialog_013) {
                        this._dialog_013 = sap.ui.xmlfragment(this.getView().getId("InwordSTODocNo_dialog"), "gatepass.view.fragments.reports.Inword_STO_Doc_No", this);
                        this.getView().addDependent(this._dialog_013);
                    }
                    this._dialog_013.open();
                }
            } else if(KeyData === "Outword"){
                if(GetIODataKey === "9"){
                    if (!this._dialog_09) {
                        this._dialog_09 = sap.ui.xmlfragment(this.getView().getId("VenRtn_dialog"), "gatepass.view.fragments.reports.Vendor_Return_Head", this);
                        this.getView().addDependent(this._dialog_09);
                    }
                    this._dialog_09.open();
                }
                else if(GetIODataKey === "10"){
                    if (!this._dialog_010) {
                        this._dialog_010 = sap.ui.xmlfragment(this.getView().getId("INRtnCln_dialog"), "gatepass.view.fragments.reports.OUT_Returnable_Challan_Head", this);
                        this.getView().addDependent(this._dialog_010);
                    }
                    this._dialog_010.open();
                }
                else if(GetIODataKey === "11"){
                    if (!this._dialog_011) {
                        this._dialog_011 = sap.ui.xmlfragment(this.getView().getId("Subcontracting_Vendor_dialog"), "gatepass.view.fragments.reports.Subcontracting_Vendor", this);
                        this.getView().addDependent(this._dialog_011);
                    }
                    this._dialog_011.open();
                }
                else if(GetIODataKey === "12"){
                    if (!this._dialog_012) {
                        this._dialog_012 = sap.ui.xmlfragment(this.getView().getId("SalesSTODocNo_dialog"), "gatepass.view.fragments.reports.Sales_STO", this);
                        this.getView().addDependent(this._dialog_012);
                    }
                    this._dialog_012.open();
                }

            }
        },
        
        OnGataPassNoSearch: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter("Id", FilterOperator.Contains, sValue);
            var oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([oFilter]);
        },

        OnGataPassNoSelect : function (oEvent) {
            var oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([]);
            var aContexts = oEvent.getParameter("selectedContexts");
            var Id;
            if (aContexts && aContexts.length) {
                aContexts.map(function (oContext) {
                    Id = oContext.getObject().Id;
                    return;
                });
                this.getView().byId("Gate_Pass_No_H").setValue(Id);
            }
        }, 

        OnGatePassEnter:function(oEvent){
            // var GetData = oEvent.getParameter("suggestValue");
            var GetData = this.getView().byId("Enter_Gate_Pass_No_H").getValue();
            let GetTemp = GetData.substr(0, 5)
                if(GetTemp === "10002"){
                    var model0 = this.getOwnerComponent().getModel("YY1_GENERAL_PURCHASE_CDS");
                    var EntitySet = "/YY1_GENERAL_PURCHASE";

                    var that = this;
                    model0.read(""+EntitySet+"", {
                        success: function (oData, oRespons) {
                            var oJSONModel = new sap.ui.model.json.JSONModel({
                                Samples: oData.results
                            });
                            that.getView().setModel(oJSONModel, "JModel");
                            console.log(oJSONModel);
                        }
                    });

                        if(GetData.length !== ""){
                            this.getView().byId("Go_Button").setEnabled(true);
                        }             
                }
                else if(GetTemp === "10001"){
                    var model0 = this.getOwnerComponent().getModel("YY1_CASH_PURCHASE_CDS");
                    var EntitySet = "/YY1_CASH_PURCHASE";

                    var that = this;
                    model0.read(""+EntitySet+"", {
                        success: function (oData, oRespons) {
                            var oJSONModel = new sap.ui.model.json.JSONModel({
                                Samples: oData.results
                            });
                            that.getView().setModel(oJSONModel, "JModel");
                            console.log(oJSONModel);
                        }
                    });
                    if(GetData.length !== ""){
                        this.getView().byId("Go_Button").setEnabled(true);
                    } 
            }
                else if(GetTemp === "10003"){
                    var model0 = this.getOwnerComponent().getModel("YY1_SALES_RETURN_CDS");
                    var EntitySet = "/YY1_SALES_RETURN";

                    var that = this;
                    model0.read(""+EntitySet+"", {
                        success: function (oData, oRespons) {
                            var oJSONModel = new sap.ui.model.json.JSONModel({
                                Samples: oData.results
                            });
                            that.getView().setModel(oJSONModel, "JModel");
                            console.log(oJSONModel);
                        }
                    });
                    if(GetData.length !== ""){
                        this.getView().byId("Go_Button").setEnabled(true);
                    } 
            }
                else if(GetTemp === "10004"){
                    var model0 = this.getOwnerComponent().getModel("YY1_IN_RETURNABLE_CLN_CDS");
                    var EntitySet = "/YY1_IN_RETURNABLE_CLN";

                    var that = this;
                    model0.read(""+EntitySet+"", {
                        success: function (oData, oRespons) {
                            var oJSONModel = new sap.ui.model.json.JSONModel({
                                Samples: oData.results
                            });
                            that.getView().setModel(oJSONModel, "JModel");
                            console.log(oJSONModel);
                        }
                    });
                    if(GetData.length !== ""){
                        this.getView().byId("Go_Button").setEnabled(true);
                    } 
            }
                else if(GetTemp === "10005"){
                    var model0 = this.getOwnerComponent().getModel("YY1_INWORD_STO_CDS");
                    var EntitySet = "/YY1_INWORD_STO";

                    var that = this;
                    model0.read(""+EntitySet+"", {
                        success: function (oData, oRespons) {
                            var oJSONModel = new sap.ui.model.json.JSONModel({
                                Samples: oData.results
                            });
                            that.getView().setModel(oJSONModel, "JModel");
                            console.log(oJSONModel);
                        }
                    });
                    if(GetData.length !== ""){
                        this.getView().byId("Go_Button").setEnabled(true);
                    } 
            }
                else if(GetTemp === "20005"){
                    var model0 = this.getOwnerComponent().getModel("YY1_VENDOR_RETURN_OW_CDS");
                    var EntitySet = "/YY1_VENDOR_RETURN_OW";

                    var that = this;
                    model0.read(""+EntitySet+"", {
                        success: function (oData, oRespons) {
                            var oJSONModel = new sap.ui.model.json.JSONModel({
                                Samples: oData.results
                            });
                            that.getView().setModel(oJSONModel, "JModel");
                            console.log(oJSONModel);
                        }
                    });
                    if(GetData.length !== ""){
                        this.getView().byId("Go_Button").setEnabled(true);
                    } 
            }
                else if(GetTemp === "20002"){
                    var model0 = this.getOwnerComponent().getModel("YY1_RETURN_CHALLAN_OW_CDS");
                    var EntitySet = "/YY1_RETURN_CHALLAN_OW";

                    var that = this;
                    model0.read(""+EntitySet+"", {
                        success: function (oData, oRespons) {
                            var oJSONModel = new sap.ui.model.json.JSONModel({
                                Samples: oData.results
                            });
                            that.getView().setModel(oJSONModel, "JModel");
                            console.log(oJSONModel);
                        }
                    });
                    if(GetData.length !== ""){
                        this.getView().byId("Go_Button").setEnabled(true);
                    } 
            }
                else if(GetTemp === "20004"){
                    var model0 = this.getOwnerComponent().getModel("YY1_SUBCONTRACTING_VENDOR_CDS");
                    var EntitySet = "/YY1_SUBCONTRACTING_VENDOR";

                    var that = this;
                    model0.read(""+EntitySet+"", {
                        success: function (oData, oRespons) {
                            var oJSONModel = new sap.ui.model.json.JSONModel({
                                Samples: oData.results
                            });
                            that.getView().setModel(oJSONModel, "JModel");
                            console.log(oJSONModel);
                        }
                    });
                    if(GetData.length !== ""){
                        this.getView().byId("Go_Button").setEnabled(true);
                    } 
            }
                else if(GetTemp === "20001"){
                    var model0 = this.getOwnerComponent().getModel("YY1_SALES_STO_CDS");
                    var EntitySet = "/YY1_SALES_STO";

                    var that = this;
                    model0.read(""+EntitySet+"", {
                        success: function (oData, oRespons) {
                            var oJSONModel = new sap.ui.model.json.JSONModel({
                                Samples: oData.results
                            });
                            that.getView().setModel(oJSONModel, "JModel");
                            console.log(oJSONModel);
                        }
                    });
                    if(GetData.length !== ""){
                        this.getView().byId("Go_Button").setEnabled(true);
                    } 
            }
            else{

                var JSonModel01 = new sap.ui.model.json.JSONModel({
                    Samples : [
                    {key:"0",Id:"10001"},
                    {key:"1",Id:"10002"},
                    {key:"2",Id:"10003"},
                    {key:"3",Id:"10004"},
                    {key:"4",Id:"10005"},
                    {key:"5",Id:"10006"},
                    {key:"6",Id:"10007"},
                    {key:"7",Id:"10008"},
                    {key:"8",Id:"10009"},
                    {key:"9",Id:"10010"},
                    {key:"10",Id:"10011"},
                    {key:"11",Id:"10012"},
                    {key:"12",Id:"10013"},
                    {key:"13",Id:"10014"},
                    {key:"14",Id:"10015"}
                    ]	
                    });
            this.getView().setModel(JSonModel01, "JModel");

            }
        },

        OnReset:function(){
            // console.log(this.getView().byId("Id_I_O").getSelectedKey());
            this.getView().byId("Plant_H").setValue("");
            this.getView().byId("Plant_Name_H").setText("");
            this.getView().byId("Id_I_O").setValue("");
            this.getView().byId("I_O_combobox").setValue("");
            this.getView().byId("Gate_Pass_No_H").setValue("");
            this.getView().byId("from_date").setValue("");
            this.getView().byId("to_date").setValue("");

            this.getView().byId("Gate_Pass_No_H").setVisible(false);
            this.getView().byId("Lebel_Gate_Pass_No_H").setVisible(false);
            this.getView().byId("Lebel_Enter_Gate_Pass_No_H").setVisible(true);
            this.getView().byId("Enter_Gate_Pass_No_H").setVisible(true);

            var mModel = new sap.ui.model.json.JSONModel({
                Samples : [
                {key:"0",text:""},
                ]	
                });
        this.getView().setModel(mModel, "mModel");

        },

        OnGoItemPage:function(){

        //    var General_Purchase = "true";
        //    var Cash_Purchase = "true";
        //    var Sales_Return = "true";
        //    var Returnable_Challan = "false";
        //    var Customer = "false";
        //    var Supplying = "false";
        //    var Vendor = "false";
        //    var Inward = "false";
        //    var STO_Returns = "false";
        //    var Vendor_Return = "false";
        //    var Returnable_Challan = "false";
        //    var Subcontractiong = "false";
        //    var Sales_STO = "false";
        //    var Unprocessed_Loan_Material = "false";
        //    var Non_Returnable_Challan = "false";

            if(this.getView().byId("Plant_H").getValue() !== ""){
                var Plant = this.getView().byId("Plant_H").getValue();
            }else{
                var Plant = "_";
            }

            if(this.getView().byId("Id_I_O").getValue() !== ""){
                var KeyData = this.getView().byId("Id_I_O").getValue();
            }else{
                var KeyData = "_";
            }
            
            if(this.getView().byId("I_O_combobox").getValue() !== ""){
                var Gate_pass_type01 = this.getView().byId("I_O_combobox").getValue();
                var Gate_pass_type = this.getView().byId("I_O_combobox").getSelectedKey();
            }else{
                var Gate_pass_type = "_";
            }

            if(this.getView().byId("Gate_Pass_No_H").getValue() !== ""){
                var Gate_Pass_No = this.getView().byId("Gate_Pass_No_H").getValue();
            }else{
                var Gate_Pass_No = "_";
            }

            if(this.getView().byId("Enter_Gate_Pass_No_H").getValue() !== ""){
                var Enter_Gate_Pass_No = this.getView().byId("Enter_Gate_Pass_No_H").getValue();
            }else{
                var Enter_Gate_Pass_No = "_";
            }

            if(this.getView().byId("from_date").getValue() !== ""){
                var from_date = this.getView().byId("from_date").getValue();
            }else{
                var from_date = "_";
            }
            
            if(this.getView().byId("to_date").getValue() !== ""){
                var to_date = this.getView().byId("to_date").getValue();
            }else{
                var to_date = "_";
            }
            console.log(Enter_Gate_Pass_No.length);

            if(Gate_pass_type === "_" && Enter_Gate_Pass_No ==="_"){
                MessageBox.error("Please Enter Atlease One Filed");
                console.log("0001")
            }else if(Gate_pass_type === "_" && Enter_Gate_Pass_No.length !== 10){
                MessageBox.error("Please Enter Correct Document No");
                console.log("0002")
            }            
            
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("item_gatepass_report", {
                    plant: Plant, // Replace with your first parameter value
                    gate_pass_type: Gate_pass_type,  // Replace with your second parameter value
                    gate_pass_no: Gate_Pass_No,  // Replace with your second parameter value
                    enter_gate_pass_No: Enter_Gate_Pass_No,  // Replace with your second parameter value
                    from_date: from_date,  // Replace with your second parameter value
                    to_date: to_date  // Replace with your second parameter value
                });
    
        
                
        },

        OnDelete:function(){
            var model0 = this.getOwnerComponent().getModel("YY1_GENERAL_PURCHASE_CDS");
            var EntitySet = "/YY1_GENERAL_PURCHASE";


                var that = this;
                model0.read(""+EntitySet+"", {
                    success: function (oData, oRespons) {
                        console.log(oData);
                        var aItems = oData.results;
                                for (var i = 0; i < aItems.length; i++) {
                                    // console.log(aItems[i].SAP_UUID)
                                    var SAP_UUID = aItems[i].SAP_UUID;

                                    var oModel05 = that.getView().getModel("YY1_GENERAL_PURCHASE_CDS");
                                    oModel05.setHeaders({
                                    "X-Requested-With": "X",
                                    "Content-Type": "application/json"
                                    });
                    
                                    oModel05.remove("/YY1_GENERAL_PURCHASE(guid'" + SAP_UUID + "')", {
                                    success: function(data) {
                                        MessageToast.show("Deleted")
                                    },
                                    error: function(error) {
                                        console.error("Error updating header:", error);
                                        MessageToast.show("Not Deleted")
                                    }
                                    });
                                }
                    }
                });

        },


        });
    });
