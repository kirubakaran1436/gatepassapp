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

    // ----- For InBound -----
    // key:"0",text:"General Purchase"
    // key:"1",text:"Cash Purchase"
    // key:"2",text:"Sales Return"
    // key:"3",text:"Returnable Challan"
    // key:"4",text:"Customer"
    // key:"5",text:"Supplying Plant"
    // key:"6",text:"Vendor"
    // key:"7",text:"Inward-STO"
    // key:"8",text:"STO Returns"

    // ----- For OutBound -----
    // key:"9",text:"Vendor Return"
    // key:"10",text:"Returnable Challan"
    // key:"11",text:"Subcontractiong"
    // key:"12",text:"Sales/STO"
    // key:"13",text:"Unprocessed Loan Material"
    // key:"14",text:"Non Returnable Challan"



    function (Controller, MessageBox, MessageToast, Fragment, Filter, FilterOperator, JSONModel, UI5Date) {
        "use strict";

        return Controller.extend("gatepass.controller.View1", {
            onInit: function () {

                var DefaultModel = this.getOwnerComponent().getModel();
                console.log("=------------------DefaultModel-----------------=");
                console.log(DefaultModel);

                this.Select_Key = "";
            },

            select_i_o:function(oEvent){ 
                let Selected_Options = oEvent.oSource.getSelectedItem().getText();
                let Selected_Options_Key = oEvent.oSource.getSelectedItem().getKey();
                if (Selected_Options_Key === "1"){

                    var mModel = new sap.ui.model.json.JSONModel({
                        Samples : [
                        {key:"0",text:"General Purchase", icon:"sap-icon://message-success"},
                        {key:"1",text:"Cash Purchase", icon:"sap-icon://message-success"},
                        {key:"2",text:"Sales Return", icon:"sap-icon://message-success"},
                        {key:"3",text:"Subcontracting Goods Receipt", icon:"sap-icon://message-success"},
                        {key:"4",text:"Customer", icon:"sap-icon://sys-cancel-2"},
                        {key:"5",text:"Supplying Plant", icon:"sap-icon://sys-cancel-2"},
                        {key:"6",text:"Vendor", icon:"sap-icon://sys-cancel-2"},
                        {key:"7",text:"STP Goods Receipt", icon:"sap-icon://message-success"},
                        {key:"8",text:"STO Returns", icon:"sap-icon://sys-cancel-2"}
                        ]	
                        });
                this.getView().setModel(mModel, "mModel");

                this.getView().byId("Inword_Lebel").setText("Select Inward");
                // this.getView().byId("Inword_combobox").setPlaceholder("Select Inward");
                this.getView().byId("Inword_Lebel").setVisible(true);
                this.getView().byId("Inword_combobox").setSelectedItem("");
                this.getView().byId("Inword_combobox").setSelectedKey("");
                this.getView().byId("Inword_combobox").setVisible(true);
                this.getView().byId("Execute_Button").setVisible(false);
                this.Select_Key = "";
                }

                else if ( Selected_Options_Key === "2"){

                    var mModel = new sap.ui.model.json.JSONModel({
                        Samples : [
                        {key:"9",text:"Vendor Return", icon:"sap-icon://message-success"},
                        // {key:"10",text:"Returnable Challan", icon:"sap-icon://message-success"},
                        {key:"11",text:"Subcontractiong", icon:"sap-icon://message-success"},
                        {key:"12",text:"Sales/STO", icon:"sap-icon://message-success"},
                        {key:"13",text:"Unprocessed Loan Material", icon:"sap-icon://sys-cancel-2"},
                        {key:"14",text:"Non Returnable Challan", icon:"sap-icon://sys-cancel-2"},
                        ]	
                        });
                this.getView().setModel(mModel, "mModel");
                this.getView().byId("Inword_Lebel").setText("Select Outward");
                // this.getView().byId("Inword_combobox").setPlaceholder("Select Outward");
                this.getView().byId("Inword_combobox").setSelectedItem("");
                this.getView().byId("Inword_combobox").setSelectedKey("");
                this.getView().byId("Inword_Lebel").setVisible(true);
                this.getView().byId("Inword_combobox").setVisible(true);
                this.getView().byId("Execute_Button").setVisible(false);
                this.Select_Key = "";
                }

                else if ( Selected_Options_Key === "3"){

                    var mModel = new sap.ui.model.json.JSONModel({
                        Samples : [
                        {key:"15",text:"Gate Pass Report"},
                        ]	
                        });
                this.getView().setModel(mModel, "mModel");
                this.getView().byId("Inword_Lebel").setText("Select Report");
                this.getView().byId("Inword_combobox").setSelectedItem("");
                this.getView().byId("Inword_combobox").setSelectedKey("");
                this.getView().byId("Inword_Lebel").setVisible(true);
                this.getView().byId("Inword_combobox").setVisible(true);
                this.getView().byId("Execute_Button").setVisible(false);
                this.Select_Key = "";
                }

                
                else if ( Selected_Options_Key === "4"){

                    var mModel = new sap.ui.model.json.JSONModel({
                        Samples : [
                        {},
                        ]	
                        });
                this.getView().setModel(mModel, "mModel");
                this.getView().byId("Inword_Lebel").setText("Select Report");
                this.getView().byId("Inword_combobox").setSelectedItem("");
                this.getView().byId("Inword_combobox").setSelectedKey("");
                this.getView().byId("Inword_Lebel").setVisible(false);
                this.getView().byId("Inword_combobox").setVisible(false);
                this.getView().byId("Execute_Button").setVisible(true);
                this.Select_Key = "";
                }
                
                else if ( Selected_Options_Key === "5"){

                    var mModel = new sap.ui.model.json.JSONModel({
                        Samples : [
                        {key:"15",text:"Gate Pass Report"},
                        ]	
                        });
                this.getView().setModel(mModel, "mModel");
                this.getView().byId("Inword_Lebel").setText("Select Report");
                this.getView().byId("Inword_combobox").setSelectedItem("");
                this.getView().byId("Inword_combobox").setSelectedKey("");
                this.getView().byId("Inword_Lebel").setVisible(false);
                this.getView().byId("Inword_combobox").setVisible(false);
                this.getView().byId("Execute_Button").setVisible(true);
                this.Select_Key = "";
                }
                
            },

            InSelect_Combo:function(oEvent){
                let Data1 = oEvent.oSource.getSelectedItem().getText();
                
                if (Data1 === ""){
                    this.getView().byId("Execute_Button").setVisible(false);
                }
                if ( Data1 !== ""){
                    this.getView().byId("Execute_Button").setVisible(true);
                    this.Select_Key = oEvent.oSource.getSelectedItem().getKey();
                }
            },

            GoButton: function () {
                if (this.Select_Key === "0"){
                    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    oRouter.navTo("general_purchase");
                }
                    else if (this.Select_Key === "1"){
                        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                        oRouter.navTo("cash_purchase");
                    }
                    else if (this.Select_Key === "2"){
                        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                        oRouter.navTo("sales_return");
                    }
    
                    else if (this.Select_Key === "3"){
                        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                        oRouter.navTo("returnable_challan");
                    }
                    
                    else if (this.Select_Key === "12"){
                        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                        oRouter.navTo("Sales_STO");
                    }


                    else if (this.Select_Key === "7"){
                        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                        oRouter.navTo("inword_sto");
                    }
    
                    else if (this.Select_Key === "15"){
                        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                        oRouter.navTo("header_gatepass_report");
                    }

                    else if (this.Select_Key === "10"){
                        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                        oRouter.navTo("returnable_challan_ow");
                    }

                    else if (this.Select_Key === "9"){
                        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                        oRouter.navTo("vendor_return");
                    }

                    else if (this.Select_Key === "11"){
                        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                        oRouter.navTo("Subcontracting_Vendor");
                    }

                    else if (this.getView().byId("_IDGenComboBox1").getValue() === "Approve Process"){
                        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                        oRouter.navTo("head_approve");
                    }

                    
                    else{
                        MessageToast.show("That Page is Under Development...")
                    }
                
            },

        });
    });
