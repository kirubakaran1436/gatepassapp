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
    'sap/ui/export/library',
	'sap/ui/export/Spreadsheet',
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    // For Page Navigation

    function (Controller, MessageBox, MessageToast, Fragment, Filter, FilterOperator, JSONModel, UI5Date, library, Spreadsheet) {
        "use strict";
        

        return Controller.extend("gatepass.controller.report.item_gatepass_report", {
            onInit: function() {
                
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("item_gatepass_report").attachPatternMatched(this._onRouteMatched, this);
            },
            
            _onRouteMatched: function(oEvent) {

                // ------- Loder Model Boc Open - Enable ----------------
                if (!this._pBusyDialog) {
                    this._pBusyDialog = sap.ui.xmlfragment(this.getView().getId("BusyDialog"), "gatepass.view.fragments.BusyIndicator", this);
                    this.getView().addDependent(this._pBusyDialog);
                }
                this._pBusyDialog.open();
                // ------- Loder Model Boc Open - Enable ----------------

                var params = oEvent.getParameter("arguments");
                var plant = params.plant;
                var gate_pass_type = params.gate_pass_type;
                var gate_pass_no = params.gate_pass_no;
                var enter_gate_pass_No = params.enter_gate_pass_No;
                let Get_enter_gate_pass_No = enter_gate_pass_No.substr(0, 5)
                var from_date = params.from_date;
                var to_date = params.to_date;

                // if(from_date !== "_" && to_date !== "_"){
                //     var BTDateFilter = new sap.ui.model.Filter("Posting_Date", "BT", from_date, to_date);
                // }else if( from_date !== "_" && to_date === "_"){
                //     var BTDateFilter = new sap.ui.model.Filter("Posting_Date", "Contains", from_date);
                // }else if( from_date === "_" && to_date !== "_"){
                //     var BTDateFilter = new sap.ui.model.Filter("Posting_Date", "Contains", to_date); 
                // }else if( from_date === "_" && to_date === "_"){
                //     // var BTDateFilter = new sap.ui.model.Filter("Posting_Date", "Contains", "");
                // }
             
                if(enter_gate_pass_No === "_"){ // For GatePassType is Given (Not Empty)
                    if (gate_pass_type === "0"){ // For General Purchase === GatePassType Select
                        if(gate_pass_no !== "_"){
                            this.getView().byId("general_purchase_table").setVisible(true);
                            this.getView().byId("cash_purchase_table").setVisible(false);
                            this.getView().byId("sales_return_table").setVisible(false);
                            this.getView().byId("in_returnable_challan_table").setVisible(false);
                            this.getView().byId("vendor_return_table").setVisible(false);
                            this.getView().byId("out_returnable_challan_table").setVisible(false);
                            this.getView().byId("subcontracting_vendor_table").setVisible(false);
                            this.getView().byId("sales_sto_table").setVisible(false);
                            this.getView().byId("inword_sales_sto_table").setVisible(false); //dsdsdsdsdsdsdsd

                            this.getView().byId("Ref_Data01").setValue(gate_pass_type);

                            var model0 = this.getOwnerComponent().getModel("YY1_GENERAL_PURCHASE_CDS");
                            var EntitySet = "/YY1_TO_ITEM_GENERAL_PURCHASE";
                            var oFilter = new sap.ui.model.Filter("Id", sap.ui.model.FilterOperator.EQ, gate_pass_no);

                            if(from_date !== "_" && to_date !== "_"){
                                var BTDateFilter = new sap.ui.model.Filter("Posting_Date", "BT", from_date, to_date);
                                var oFilters = [oFilter, BTDateFilter];
                            }else if( from_date !== "_" && to_date === "_"){
                                var BTDateFilter = new sap.ui.model.Filter("Posting_Date", "Contains", from_date);
                                var oFilters = [oFilter, BTDateFilter];
                            }else if( from_date === "_" && to_date !== "_"){
                                var BTDateFilter = new sap.ui.model.Filter("Posting_Date", "Contains", to_date); 
                                var oFilters = [oFilter, BTDateFilter];
                            }else if( from_date === "_" && to_date ==="_"){
                                var oFilters = [oFilter];
                            }
                        }else{
                            var model0 = this.getOwnerComponent().getModel("YY1_GENERAL_PURCHASE_CDS");
                            var EntitySet = "/YY1_TO_ITEM_GENERAL_PURCHASE";
                            
                            this.getView().byId("general_purchase_table").setVisible(true);
                            this.getView().byId("cash_purchase_table").setVisible(false);
                            this.getView().byId("sales_return_table").setVisible(false);
                            this.getView().byId("in_returnable_challan_table").setVisible(false);
                            this.getView().byId("vendor_return_table").setVisible(false);
                            this.getView().byId("out_returnable_challan_table").setVisible(false);
                            this.getView().byId("subcontracting_vendor_table").setVisible(false);
                            this.getView().byId("sales_sto_table").setVisible(false);
                            this.getView().byId("inword_sales_sto_table").setVisible(false); //dsdsdsdsdsdsdsd

                            this.getView().byId("Ref_Data01").setValue(gate_pass_type);
                        }
                        
                    }
                    else if (gate_pass_type === "1"){

                        if(gate_pass_no !== "_"){
                            this.getView().byId("general_purchase_table").setVisible(false);
                            this.getView().byId("cash_purchase_table").setVisible(true);
                            this.getView().byId("sales_return_table").setVisible(false);
                            this.getView().byId("in_returnable_challan_table").setVisible(false);
                            this.getView().byId("vendor_return_table").setVisible(false);
                            this.getView().byId("out_returnable_challan_table").setVisible(false);
                            this.getView().byId("subcontracting_vendor_table").setVisible(false);
                            this.getView().byId("sales_sto_table").setVisible(false);
                            this.getView().byId("inword_sales_sto_table").setVisible(false); //dsdsdsdsdsdsdsd

                            this.getView().byId("Ref_Data01").setValue(gate_pass_type);

                            var model0 = this.getOwnerComponent().getModel("YY1_CASH_PURCHASE_CDS");
                            var EntitySet = "/YY1_ITEM_CASH_PURCHASE";
                            var oFilter = new sap.ui.model.Filter("Id", sap.ui.model.FilterOperator.EQ, gate_pass_no);
                            if(from_date !== "_" && to_date !== "_"){
                                var BTDateFilter = new sap.ui.model.Filter("Posting_Date", "BT", from_date, to_date);
                                var oFilters = [oFilter, BTDateFilter];
                            }else if( from_date !== "_" && to_date === "_"){
                                var BTDateFilter = new sap.ui.model.Filter("Posting_Date", "Contains", from_date);
                                var oFilters = [oFilter, BTDateFilter];
                            }else if( from_date === "_" && to_date !== "_"){
                                var BTDateFilter = new sap.ui.model.Filter("Posting_Date", "Contains", to_date); 
                                var oFilters = [oFilter, BTDateFilter];
                            }else if( from_date === "_" && to_date ==="_"){
                                var oFilters = [oFilter];
                            }
                            
                            
                        }else{
                            var model0 = this.getOwnerComponent().getModel("YY1_CASH_PURCHASE_CDS");
                            var EntitySet = "/YY1_ITEM_CASH_PURCHASE";
                            this.getView().byId("general_purchase_table").setVisible(false);
                            this.getView().byId("cash_purchase_table").setVisible(true);
                            this.getView().byId("sales_return_table").setVisible(false);
                            this.getView().byId("in_returnable_challan_table").setVisible(false);
                            this.getView().byId("vendor_return_table").setVisible(false);
                            this.getView().byId("out_returnable_challan_table").setVisible(false);
                            this.getView().byId("subcontracting_vendor_table").setVisible(false);
                            this.getView().byId("sales_sto_table").setVisible(false);
                            this.getView().byId("inword_sales_sto_table").setVisible(false); //dsdsdsdsdsdsdsd

                            this.getView().byId("Ref_Data01").setValue(gate_pass_type);
                        }

                    }
                    else if (gate_pass_type === "2"){

                        if(gate_pass_no !== "_"){
                            this.getView().byId("general_purchase_table").setVisible(false);
                            this.getView().byId("cash_purchase_table").setVisible(false);
                            this.getView().byId("sales_return_table").setVisible(true);
                            this.getView().byId("in_returnable_challan_table").setVisible(false);
                            this.getView().byId("vendor_return_table").setVisible(false);
                            this.getView().byId("out_returnable_challan_table").setVisible(false);
                            this.getView().byId("subcontracting_vendor_table").setVisible(false);
                            this.getView().byId("sales_sto_table").setVisible(false);
                            this.getView().byId("inword_sales_sto_table").setVisible(false); //dsdsdsdsdsdsdsd

                            this.getView().byId("Ref_Data01").setValue(gate_pass_type);

                            var model0 = this.getOwnerComponent().getModel("YY1_SALES_RETURN_CDS");
                            var EntitySet = "/YY1_ITEM_SALES_RETURN";
                            var oFilter = new sap.ui.model.Filter("Id", sap.ui.model.FilterOperator.EQ, gate_pass_no);
                            if(from_date !== "_" && to_date !== "_"){
                                var BTDateFilter = new sap.ui.model.Filter("Posting_Date", "BT", from_date, to_date);
                                var oFilters = [oFilter, BTDateFilter];
                            }else if( from_date !== "_" && to_date === "_"){
                                var BTDateFilter = new sap.ui.model.Filter("Posting_Date", "Contains", from_date);
                                var oFilters = [oFilter, BTDateFilter];
                            }else if( from_date === "_" && to_date !== "_"){
                                var BTDateFilter = new sap.ui.model.Filter("Posting_Date", "Contains", to_date); 
                                var oFilters = [oFilter, BTDateFilter];
                            }else if( from_date === "_" && to_date ==="_"){
                                var oFilters = [oFilter];
                            }
                            
                            
                        }else{
                            var model0 = this.getOwnerComponent().getModel("YY1_SALES_RETURN_CDS");
                            var EntitySet = "/YY1_ITEM_SALES_RETURN";
                            this.getView().byId("general_purchase_table").setVisible(false);
                            this.getView().byId("cash_purchase_table").setVisible(false);
                            this.getView().byId("sales_return_table").setVisible(true);
                            this.getView().byId("in_returnable_challan_table").setVisible(false);
                            this.getView().byId("vendor_return_table").setVisible(false);
                            this.getView().byId("out_returnable_challan_table").setVisible(false);
                            this.getView().byId("subcontracting_vendor_table").setVisible(false);
                            this.getView().byId("sales_sto_table").setVisible(false);
                            this.getView().byId("inword_sales_sto_table").setVisible(false); //dsdsdsdsdsdsdsd

                            this.getView().byId("Ref_Data01").setValue(gate_pass_type);
                        }

                    }
                    else if (gate_pass_type === "3"){

                        if(gate_pass_no !== "_"){
                            this.getView().byId("general_purchase_table").setVisible(false);
                            this.getView().byId("cash_purchase_table").setVisible(false);
                            this.getView().byId("sales_return_table").setVisible(false);
                            this.getView().byId("in_returnable_challan_table").setVisible(true);
                            this.getView().byId("vendor_return_table").setVisible(false);
                            this.getView().byId("out_returnable_challan_table").setVisible(false);
                            this.getView().byId("subcontracting_vendor_table").setVisible(false);
                            this.getView().byId("sales_sto_table").setVisible(false);
                            this.getView().byId("inword_sales_sto_table").setVisible(false); //dsdsdsdsdsdsdsd

                            this.getView().byId("Ref_Data01").setValue(gate_pass_type);

                            var model0 = this.getOwnerComponent().getModel("YY1_IN_RETURNABLE_CLN_CDS");
                            var EntitySet = "/YY1_ITEMS_IN_RETURNABLE_CLN";
                            var oFilter = new sap.ui.model.Filter("Id", sap.ui.model.FilterOperator.EQ, gate_pass_no);
                            if(from_date !== "_" && to_date !== "_"){
                                var BTDateFilter = new sap.ui.model.Filter("Posting_Date", "BT", from_date, to_date);
                                var oFilters = [oFilter, BTDateFilter];
                            }else if( from_date !== "_" && to_date === "_"){
                                var BTDateFilter = new sap.ui.model.Filter("Posting_Date", "Contains", from_date);
                                var oFilters = [oFilter, BTDateFilter];
                            }else if( from_date === "_" && to_date !== "_"){
                                var BTDateFilter = new sap.ui.model.Filter("Posting_Date", "Contains", to_date); 
                                var oFilters = [oFilter, BTDateFilter];
                            }else if( from_date === "_" && to_date ==="_"){
                                var oFilters = [oFilter];
                            }
                            
                            
                        }else{
                            var model0 = this.getOwnerComponent().getModel("YY1_IN_RETURNABLE_CLN_CDS");
                            var EntitySet = "/YY1_ITEMS_IN_RETURNABLE_CLN";
                            this.getView().byId("general_purchase_table").setVisible(false);
                            this.getView().byId("cash_purchase_table").setVisible(false);
                            this.getView().byId("sales_return_table").setVisible(false);
                            this.getView().byId("in_returnable_challan_table").setVisible(true);
                            this.getView().byId("vendor_return_table").setVisible(false);
                            this.getView().byId("out_returnable_challan_table").setVisible(false);
                            this.getView().byId("subcontracting_vendor_table").setVisible(false);
                            this.getView().byId("sales_sto_table").setVisible(false);
                            this.getView().byId("inword_sales_sto_table").setVisible(false); //dsdsdsdsdsdsdsd

                            this.getView().byId("Ref_Data01").setValue(gate_pass_type);
                        }

                    }
                    else if (gate_pass_type === "7"){

                        if(gate_pass_no !== "_"){
                            this.getView().byId("general_purchase_table").setVisible(false);
                            this.getView().byId("cash_purchase_table").setVisible(false);
                            this.getView().byId("sales_return_table").setVisible(false);
                            this.getView().byId("in_returnable_challan_table").setVisible(false);
                            this.getView().byId("vendor_return_table").setVisible(false);
                            this.getView().byId("out_returnable_challan_table").setVisible(false);
                            this.getView().byId("subcontracting_vendor_table").setVisible(false);
                            this.getView().byId("sales_sto_table").setVisible(false);
                            this.getView().byId("inword_sales_sto_table").setVisible(true); //dsdsdsdsdsdsdsd

                            this.getView().byId("Ref_Data01").setValue(gate_pass_type);

                            var model0 = this.getOwnerComponent().getModel("YY1_INWORD_STO_CDS");
                            var EntitySet = "/YY1_ITEMS_INWORD_STO";
                            var oFilter = new sap.ui.model.Filter("Id", sap.ui.model.FilterOperator.EQ, gate_pass_no);
                            if(from_date !== "_" && to_date !== "_"){
                                var BTDateFilter = new sap.ui.model.Filter("Posting_Date", "BT", from_date, to_date);
                                var oFilters = [oFilter, BTDateFilter];
                            }else if( from_date !== "_" && to_date === "_"){
                                var BTDateFilter = new sap.ui.model.Filter("Posting_Date", "Contains", from_date);
                                var oFilters = [oFilter, BTDateFilter];
                            }else if( from_date === "_" && to_date !== "_"){
                                var BTDateFilter = new sap.ui.model.Filter("Posting_Date", "Contains", to_date); 
                                var oFilters = [oFilter, BTDateFilter];
                            }else if( from_date === "_" && to_date ==="_"){
                                var oFilters = [oFilter];
                            }
                            
                            
                        }else{
                            var model0 = this.getOwnerComponent().getModel("YY1_INWORD_STO_CDS");
                            var EntitySet = "/YY1_ITEMS_INWORD_STO";
                            this.getView().byId("general_purchase_table").setVisible(false);
                            this.getView().byId("cash_purchase_table").setVisible(false);
                            this.getView().byId("sales_return_table").setVisible(false);
                            this.getView().byId("in_returnable_challan_table").setVisible(false);
                            this.getView().byId("vendor_return_table").setVisible(false);
                            this.getView().byId("out_returnable_challan_table").setVisible(false);
                            this.getView().byId("subcontracting_vendor_table").setVisible(false);
                            this.getView().byId("sales_sto_table").setVisible(false);
                            this.getView().byId("inword_sales_sto_table").setVisible(true); //dsdsdsdsdsdsdsd

                            this.getView().byId("Ref_Data01").setValue(gate_pass_type);
                        }

                    }
                    else if (gate_pass_type === "9") {

                        if(gate_pass_no !== "_"){
                            this.getView().byId("general_purchase_table").setVisible(false);
                            this.getView().byId("cash_purchase_table").setVisible(false);
                            this.getView().byId("sales_return_table").setVisible(false);
                            this.getView().byId("in_returnable_challan_table").setVisible(false);
                            this.getView().byId("vendor_return_table").setVisible(true);
                            this.getView().byId("out_returnable_challan_table").setVisible(false);
                            this.getView().byId("subcontracting_vendor_table").setVisible(false);
                            this.getView().byId("sales_sto_table").setVisible(false);
                            this.getView().byId("inword_sales_sto_table").setVisible(false); //dsdsdsdsdsdsdsd

                            this.getView().byId("Ref_Data01").setValue(gate_pass_type);

                            var model0 = this.getOwnerComponent().getModel("YY1_VENDOR_RETURN_OW_CDS");
                            var EntitySet = "/YY1_ITEM_VENDOR_RETURN_OW";
                            var oFilter = new sap.ui.model.Filter("Id", sap.ui.model.FilterOperator.EQ, gate_pass_no);
                            if(from_date !== "_" && to_date !== "_"){
                                var BTDateFilter = new sap.ui.model.Filter("Posting_Date", "BT", from_date, to_date);
                                var oFilters = [oFilter, BTDateFilter];
                            }else if( from_date !== "_" && to_date === "_"){
                                var BTDateFilter = new sap.ui.model.Filter("Posting_Date", "Contains", from_date);
                                var oFilters = [oFilter, BTDateFilter];
                            }else if( from_date === "_" && to_date !== "_"){
                                var BTDateFilter = new sap.ui.model.Filter("Posting_Date", "Contains", to_date); 
                                var oFilters = [oFilter, BTDateFilter];
                            }else if( from_date === "_" && to_date ==="_"){
                                var oFilters = [oFilter];
                            }
                            
                            
                        }else{
                            var model0 = this.getOwnerComponent().getModel("YY1_VENDOR_RETURN_OW_CDS");
                            var EntitySet = "/YY1_ITEM_VENDOR_RETURN_OW";
                            this.getView().byId("general_purchase_table").setVisible(false);
                            this.getView().byId("cash_purchase_table").setVisible(false);
                            this.getView().byId("sales_return_table").setVisible(false);
                            this.getView().byId("in_returnable_challan_table").setVisible(false);
                            this.getView().byId("vendor_return_table").setVisible(true);
                            this.getView().byId("out_returnable_challan_table").setVisible(false);
                            this.getView().byId("subcontracting_vendor_table").setVisible(false);
                            this.getView().byId("sales_sto_table").setVisible(false);
                            this.getView().byId("inword_sales_sto_table").setVisible(false); //dsdsdsdsdsdsdsd

                            this.getView().byId("Ref_Data01").setValue(gate_pass_type);
                        }

                    }
                    else if (gate_pass_type === "10") {

                        if(gate_pass_no !== "_"){
                            this.getView().byId("general_purchase_table").setVisible(false);
                            this.getView().byId("cash_purchase_table").setVisible(false);
                            this.getView().byId("sales_return_table").setVisible(false);
                            this.getView().byId("in_returnable_challan_table").setVisible(false);
                            this.getView().byId("vendor_return_table").setVisible(false);
                            this.getView().byId("out_returnable_challan_table").setVisible(true);
                            this.getView().byId("subcontracting_vendor_table").setVisible(false);
                            this.getView().byId("sales_sto_table").setVisible(false);
                            this.getView().byId("inword_sales_sto_table").setVisible(false); //dsdsdsdsdsdsdsd

                            this.getView().byId("Ref_Data01").setValue(gate_pass_type);

                            var model0 = this.getOwnerComponent().getModel("YY1_RETURN_CHALLAN_OW_CDS");
                            var EntitySet = "/YY1_ITEM_RETURN_CHALLAN_OW";
                            var oFilter = new sap.ui.model.Filter("Id", sap.ui.model.FilterOperator.EQ, gate_pass_no);
                            if(from_date !== "_" && to_date !== "_"){
                                var BTDateFilter = new sap.ui.model.Filter("Posting_Date", "BT", from_date, to_date);
                                var oFilters = [oFilter, BTDateFilter];
                            }else if( from_date !== "_" && to_date === "_"){
                                var BTDateFilter = new sap.ui.model.Filter("Posting_Date", "Contains", from_date);
                                var oFilters = [oFilter, BTDateFilter];
                            }else if( from_date === "_" && to_date !== "_"){
                                var BTDateFilter = new sap.ui.model.Filter("Posting_Date", "Contains", to_date); 
                                var oFilters = [oFilter, BTDateFilter];
                            }else if( from_date === "_" && to_date ==="_"){
                                var oFilters = [oFilter];
                            }
                            
                            
                        }else{
                            var model0 = this.getOwnerComponent().getModel("YY1_RETURN_CHALLAN_OW_CDS");
                            var EntitySet = "/YY1_ITEM_RETURN_CHALLAN_OW";
                            this.getView().byId("general_purchase_table").setVisible(false);
                            this.getView().byId("cash_purchase_table").setVisible(false);
                            this.getView().byId("sales_return_table").setVisible(false);
                            this.getView().byId("in_returnable_challan_table").setVisible(false);
                            this.getView().byId("vendor_return_table").setVisible(false);
                            this.getView().byId("out_returnable_challan_table").setVisible(true);
                            this.getView().byId("subcontracting_vendor_table").setVisible(false);
                            this.getView().byId("sales_sto_table").setVisible(false);
                            this.getView().byId("inword_sales_sto_table").setVisible(false); //dsdsdsdsdsdsdsd

                            this.getView().byId("Ref_Data01").setValue(gate_pass_type);
                        }

                    }
                    else if (gate_pass_type === "11") {

                        if(gate_pass_no !== "_"){
                            this.getView().byId("general_purchase_table").setVisible(false);
                            this.getView().byId("cash_purchase_table").setVisible(false);
                            this.getView().byId("sales_return_table").setVisible(false);
                            this.getView().byId("in_returnable_challan_table").setVisible(false);
                            this.getView().byId("vendor_return_table").setVisible(false);
                            this.getView().byId("out_returnable_challan_table").setVisible(false);
                            this.getView().byId("subcontracting_vendor_table").setVisible(true);
                            this.getView().byId("sales_sto_table").setVisible(false);
                            this.getView().byId("inword_sales_sto_table").setVisible(false); //dsdsdsdsdsdsdsd

                            this.getView().byId("Ref_Data01").setValue(gate_pass_type);

                            var model0 = this.getOwnerComponent().getModel("YY1_SUBCONTRACTING_VENDOR_CDS");
                            var EntitySet = "/YY1_ITEMS_SUBCONTRACTING_VENDO";
                            var oFilter = new sap.ui.model.Filter("Id", sap.ui.model.FilterOperator.EQ, gate_pass_no);
                            if(from_date !== "_" && to_date !== "_"){
                                var BTDateFilter = new sap.ui.model.Filter("Posting_Date", "BT", from_date, to_date);
                                var oFilters = [oFilter, BTDateFilter];
                            }else if( from_date !== "_" && to_date === "_"){
                                var BTDateFilter = new sap.ui.model.Filter("Posting_Date", "Contains", from_date);
                                var oFilters = [oFilter, BTDateFilter];
                            }else if( from_date === "_" && to_date !== "_"){
                                var BTDateFilter = new sap.ui.model.Filter("Posting_Date", "Contains", to_date); 
                                var oFilters = [oFilter, BTDateFilter];
                            }else if( from_date === "_" && to_date ==="_"){
                                var oFilters = [oFilter];
                            }
                            
                            
                        }else{
                            var model0 = this.getOwnerComponent().getModel("YY1_SUBCONTRACTING_VENDOR_CDS");
                            var EntitySet = "/YY1_ITEMS_SUBCONTRACTING_VENDO";
                            this.getView().byId("general_purchase_table").setVisible(false);
                            this.getView().byId("cash_purchase_table").setVisible(false);
                            this.getView().byId("sales_return_table").setVisible(false);
                            this.getView().byId("in_returnable_challan_table").setVisible(false);
                            this.getView().byId("vendor_return_table").setVisible(false);
                            this.getView().byId("out_returnable_challan_table").setVisible(false);
                            this.getView().byId("subcontracting_vendor_table").setVisible(true);
                            this.getView().byId("sales_sto_table").setVisible(false);
                            this.getView().byId("inword_sales_sto_table").setVisible(false); //dsdsdsdsdsdsdsd

                            this.getView().byId("Ref_Data01").setValue(gate_pass_type);
                        }

                    }
                    else if (gate_pass_type === "12") {

                        if(gate_pass_no !== "_"){
                            this.getView().byId("general_purchase_table").setVisible(false);
                            this.getView().byId("cash_purchase_table").setVisible(false);
                            this.getView().byId("sales_return_table").setVisible(false);
                            this.getView().byId("in_returnable_challan_table").setVisible(false);
                            this.getView().byId("vendor_return_table").setVisible(false);
                            this.getView().byId("out_returnable_challan_table").setVisible(false);
                            this.getView().byId("subcontracting_vendor_table").setVisible(false);
                            this.getView().byId("sales_sto_table").setVisible(true);
                            this.getView().byId("inword_sales_sto_table").setVisible(false); //dsdsdsdsdsdsdsd

                            this.getView().byId("Ref_Data01").setValue(gate_pass_type);

                            var model0 = this.getOwnerComponent().getModel("YY1_SALES_STO_CDS");
                            var EntitySet = "/YY1_ITEM_SALES_STO";
                            var oFilter = new sap.ui.model.Filter("Id", sap.ui.model.FilterOperator.EQ, gate_pass_no);
                            if(from_date !== "_" && to_date !== "_"){
                                var BTDateFilter = new sap.ui.model.Filter("Posting_Date", "BT", from_date, to_date);
                                var oFilters = [oFilter, BTDateFilter];
                            }else if( from_date !== "_" && to_date === "_"){
                                var BTDateFilter = new sap.ui.model.Filter("Posting_Date", "Contains", from_date);
                                var oFilters = [oFilter, BTDateFilter];
                            }else if( from_date === "_" && to_date !== "_"){
                                var BTDateFilter = new sap.ui.model.Filter("Posting_Date", "Contains", to_date); 
                                var oFilters = [oFilter, BTDateFilter];
                            }else if( from_date === "_" && to_date ==="_"){
                                var oFilters = [oFilter];
                            }
                            
                            
                        }else{
                            var model0 = this.getOwnerComponent().getModel("YY1_SALES_STO_CDS");
                            var EntitySet = "/YY1_ITEM_SALES_STO";
                            this.getView().byId("general_purchase_table").setVisible(false);
                            this.getView().byId("cash_purchase_table").setVisible(false);
                            this.getView().byId("sales_return_table").setVisible(false);
                            this.getView().byId("in_returnable_challan_table").setVisible(false);
                            this.getView().byId("vendor_return_table").setVisible(false);
                            this.getView().byId("out_returnable_challan_table").setVisible(false);
                            this.getView().byId("subcontracting_vendor_table").setVisible(false);
                            this.getView().byId("sales_sto_table").setVisible(true);
                            this.getView().byId("inword_sales_sto_table").setVisible(false); //dsdsdsdsdsdsdsd

                            this.getView().byId("Ref_Data01").setValue(gate_pass_type);
                        }

                    }
    
                }else{
                    if (Get_enter_gate_pass_No === "10002"){ // For Enter General Purchase Document No
                        var model0 = this.getOwnerComponent().getModel("YY1_GENERAL_PURCHASE_CDS");
                        var EntitySet = "/YY1_TO_ITEM_GENERAL_PURCHASE";
                        var oFilter = new sap.ui.model.Filter("Id", sap.ui.model.FilterOperator.EQ, enter_gate_pass_No);
                            if(from_date !== "_" && to_date !== "_"){
                                var BTDateFilter = new sap.ui.model.Filter("Posting_Date", "BT", from_date, to_date);
                                var oFilters = [oFilter, BTDateFilter];
                            }else if( from_date !== "_" && to_date === "_"){
                                var BTDateFilter = new sap.ui.model.Filter("Posting_Date", "Contains", from_date);
                                var oFilters = [oFilter, BTDateFilter];
                            }else if( from_date === "_" && to_date !== "_"){
                                var BTDateFilter = new sap.ui.model.Filter("Posting_Date", "Contains", to_date); 
                                var oFilters = [oFilter, BTDateFilter];
                            }else if( from_date === "_" && to_date ==="_"){
                                var oFilters = [oFilter];
                            }
                        
                        this.getView().byId("general_purchase_table").setVisible(true);
                        this.getView().byId("cash_purchase_table").setVisible(false);
                        this.getView().byId("sales_return_table").setVisible(false);
                        this.getView().byId("in_returnable_challan_table").setVisible(false);
                        this.getView().byId("vendor_return_table").setVisible(false);
                        this.getView().byId("out_returnable_challan_table").setVisible(false);
                        this.getView().byId("subcontracting_vendor_table").setVisible(false);
                        this.getView().byId("sales_sto_table").setVisible(false);
                        this.getView().byId("inword_sales_sto_table").setVisible(false); //dsdsdsdsdsdsdsd    

                        this.getView().byId("Ref_Data01").setValue("0");
                    }
                    else if (Get_enter_gate_pass_No === "10001"){ // For Enter General Purchase Document No
                        var model0 = this.getOwnerComponent().getModel("YY1_CASH_PURCHASE_CDS");
                        var EntitySet = "/YY1_ITEM_CASH_PURCHASE";
                        var oFilter = new sap.ui.model.Filter("Id", sap.ui.model.FilterOperator.EQ, enter_gate_pass_No);
                            if(from_date !== "_" && to_date !== "_"){
                                var BTDateFilter = new sap.ui.model.Filter("Posting_Date", "BT", from_date, to_date);
                                var oFilters = [oFilter, BTDateFilter];
                            }else if( from_date !== "_" && to_date === "_"){
                                var BTDateFilter = new sap.ui.model.Filter("Posting_Date", "Contains", from_date);
                                var oFilters = [oFilter, BTDateFilter];
                            }else if( from_date === "_" && to_date !== "_"){
                                var BTDateFilter = new sap.ui.model.Filter("Posting_Date", "Contains", to_date); 
                                var oFilters = [oFilter, BTDateFilter];
                            }else if( from_date === "_" && to_date ==="_"){
                                var oFilters = [oFilter];
                            }
                        
                        this.getView().byId("general_purchase_table").setVisible(false);
                        this.getView().byId("cash_purchase_table").setVisible(true);
                        this.getView().byId("sales_return_table").setVisible(false);
                        this.getView().byId("in_returnable_challan_table").setVisible(false);
                        this.getView().byId("vendor_return_table").setVisible(false);
                        this.getView().byId("out_returnable_challan_table").setVisible(false);
                        this.getView().byId("subcontracting_vendor_table").setVisible(false);
                        this.getView().byId("sales_sto_table").setVisible(false);
                        this.getView().byId("inword_sales_sto_table").setVisible(false); //dsdsdsdsdsdsdsd

                        this.getView().byId("Ref_Data01").setValue("1");
                    
                    }
                    else if (Get_enter_gate_pass_No === "10003"){ // For Enter General Purchase Document No
                        var model0 = this.getOwnerComponent().getModel("YY1_SALES_RETURN_CDS");
                        var EntitySet = "/YY1_ITEM_SALES_RETURN";
                        var oFilter = new sap.ui.model.Filter("Id", sap.ui.model.FilterOperator.EQ, enter_gate_pass_No);
                            if(from_date !== "_" && to_date !== "_"){
                                var BTDateFilter = new sap.ui.model.Filter("Posting_Date", "BT", from_date, to_date);
                                var oFilters = [oFilter, BTDateFilter];
                            }else if( from_date !== "_" && to_date === "_"){
                                var BTDateFilter = new sap.ui.model.Filter("Posting_Date", "Contains", from_date);
                                var oFilters = [oFilter, BTDateFilter];
                            }else if( from_date === "_" && to_date !== "_"){
                                var BTDateFilter = new sap.ui.model.Filter("Posting_Date", "Contains", to_date); 
                                var oFilters = [oFilter, BTDateFilter];
                            }else if( from_date === "_" && to_date ==="_"){
                                var oFilters = [oFilter];
                            }
                        this.getView().byId("general_purchase_table").setVisible(false);
                        this.getView().byId("cash_purchase_table").setVisible(false);
                        this.getView().byId("sales_return_table").setVisible(true);
                        this.getView().byId("in_returnable_challan_table").setVisible(false);
                        this.getView().byId("vendor_return_table").setVisible(false);
                        this.getView().byId("out_returnable_challan_table").setVisible(false);
                        this.getView().byId("subcontracting_vendor_table").setVisible(false);
                        this.getView().byId("sales_sto_table").setVisible(false);
                        this.getView().byId("inword_sales_sto_table").setVisible(false); //dsdsdsdsdsdsdsd

                        this.getView().byId("Ref_Data01").setValue("2");
                    
                    }
                    else if (Get_enter_gate_pass_No === "10005"){ // For Enter General Purchase Document No
                        var model0 = this.getOwnerComponent().getModel("YY1_INWORD_STO_CDS");
                        var EntitySet = "/YY1_ITEMS_INWORD_STO";
                        var oFilter = new sap.ui.model.Filter("Id", sap.ui.model.FilterOperator.EQ, enter_gate_pass_No);
                            if(from_date !== "_" && to_date !== "_"){
                                var BTDateFilter = new sap.ui.model.Filter("Posting_Date", "BT", from_date, to_date);
                                var oFilters = [oFilter, BTDateFilter];
                            }else if( from_date !== "_" && to_date === "_"){
                                var BTDateFilter = new sap.ui.model.Filter("Posting_Date", "Contains", from_date);
                                var oFilters = [oFilter, BTDateFilter];
                            }else if( from_date === "_" && to_date !== "_"){
                                var BTDateFilter = new sap.ui.model.Filter("Posting_Date", "Contains", to_date); 
                                var oFilters = [oFilter, BTDateFilter];
                            }else if( from_date === "_" && to_date ==="_"){
                                var oFilters = [oFilter];
                            }
                        this.getView().byId("general_purchase_table").setVisible(false);
                        this.getView().byId("cash_purchase_table").setVisible(false);
                        this.getView().byId("sales_return_table").setVisible(false);
                        this.getView().byId("in_returnable_challan_table").setVisible(false);
                        this.getView().byId("vendor_return_table").setVisible(false);
                        this.getView().byId("out_returnable_challan_table").setVisible(false);
                        this.getView().byId("subcontracting_vendor_table").setVisible(false);
                        this.getView().byId("sales_sto_table").setVisible(false);
                        this.getView().byId("inword_sales_sto_table").setVisible(true); //dsdsdsdsdsdsdsd

                        this.getView().byId("Ref_Data01").setValue("2");
                    
                    }
                    else if (Get_enter_gate_pass_No === "10004"){ // For Enter General Purchase Document No
                        var model0 = this.getOwnerComponent().getModel("YY1_IN_RETURNABLE_CLN_CDS");
                        var EntitySet = "/YY1_ITEMS_IN_RETURNABLE_CLN";
                        var oFilter = new sap.ui.model.Filter("Id", sap.ui.model.FilterOperator.EQ, enter_gate_pass_No);
                            if(from_date !== "_" && to_date !== "_"){
                                var BTDateFilter = new sap.ui.model.Filter("Posting_Date", "BT", from_date, to_date);
                                var oFilters = [oFilter, BTDateFilter];
                            }else if( from_date !== "_" && to_date === "_"){
                                var BTDateFilter = new sap.ui.model.Filter("Posting_Date", "Contains", from_date);
                                var oFilters = [oFilter, BTDateFilter];
                            }else if( from_date === "_" && to_date !== "_"){
                                var BTDateFilter = new sap.ui.model.Filter("Posting_Date", "Contains", to_date); 
                                var oFilters = [oFilter, BTDateFilter];
                            }else if( from_date === "_" && to_date ==="_"){
                                var oFilters = [oFilter];
                            }
                        this.getView().byId("general_purchase_table").setVisible(false);
                        this.getView().byId("cash_purchase_table").setVisible(false);
                        this.getView().byId("sales_return_table").setVisible(false);
                        this.getView().byId("in_returnable_challan_table").setVisible(true);
                        this.getView().byId("vendor_return_table").setVisible(false);
                        this.getView().byId("out_returnable_challan_table").setVisible(false);
                        this.getView().byId("subcontracting_vendor_table").setVisible(false);
                        this.getView().byId("sales_sto_table").setVisible(false);
                        this.getView().byId("inword_sales_sto_table").setVisible(false); //dsdsdsdsdsdsdsd

                        this.getView().byId("Ref_Data01").setValue("2");
                    
                    }
                    else if (Get_enter_gate_pass_No === "20005"){ // For Enter Vendor Return
                        var model0 = this.getOwnerComponent().getModel("YY1_VENDOR_RETURN_OW_CDS");
                        var EntitySet = "/YY1_ITEM_VENDOR_RETURN_OW";
                        var oFilter = new sap.ui.model.Filter("Id", sap.ui.model.FilterOperator.EQ, enter_gate_pass_No);
                            if(from_date !== "_" && to_date !== "_"){
                                var BTDateFilter = new sap.ui.model.Filter("Posting_Date", "BT", from_date, to_date);
                                var oFilters = [oFilter, BTDateFilter];
                            }else if( from_date !== "_" && to_date === "_"){
                                var BTDateFilter = new sap.ui.model.Filter("Posting_Date", "Contains", from_date);
                                var oFilters = [oFilter, BTDateFilter];
                            }else if( from_date === "_" && to_date !== "_"){
                                var BTDateFilter = new sap.ui.model.Filter("Posting_Date", "Contains", to_date); 
                                var oFilters = [oFilter, BTDateFilter];
                            }else if( from_date === "_" && to_date ==="_"){
                                var oFilters = [oFilter];
                            }
                        this.getView().byId("general_purchase_table").setVisible(false);
                        this.getView().byId("cash_purchase_table").setVisible(false);
                        this.getView().byId("sales_return_table").setVisible(false);
                        this.getView().byId("in_returnable_challan_table").setVisible(false);
                        this.getView().byId("vendor_return_table").setVisible(true);
                        this.getView().byId("out_returnable_challan_table").setVisible(false);
                        this.getView().byId("subcontracting_vendor_table").setVisible(false);
                        this.getView().byId("sales_sto_table").setVisible(false);
                        this.getView().byId("inword_sales_sto_table").setVisible(false); //dsdsdsdsdsdsdsd

                        this.getView().byId("Ref_Data01").setValue("2");
                    
                    }
                    else if (Get_enter_gate_pass_No === "20002"){ // For Enter Outward Returnable Challan
                        var model0 = this.getOwnerComponent().getModel("YY1_RETURN_CHALLAN_OW_CDS");
                        var EntitySet = "/YY1_ITEM_RETURN_CHALLAN_OW";
                        var oFilter = new sap.ui.model.Filter("Id", sap.ui.model.FilterOperator.EQ, enter_gate_pass_No);
                            if(from_date !== "_" && to_date !== "_"){
                                var BTDateFilter = new sap.ui.model.Filter("Posting_Date", "BT", from_date, to_date);
                                var oFilters = [oFilter, BTDateFilter];
                            }else if( from_date !== "_" && to_date === "_"){
                                var BTDateFilter = new sap.ui.model.Filter("Posting_Date", "Contains", from_date);
                                var oFilters = [oFilter, BTDateFilter];
                            }else if( from_date === "_" && to_date !== "_"){
                                var BTDateFilter = new sap.ui.model.Filter("Posting_Date", "Contains", to_date); 
                                var oFilters = [oFilter, BTDateFilter];
                            }else if( from_date === "_" && to_date ==="_"){
                                var oFilters = [oFilter];
                            }
                        this.getView().byId("general_purchase_table").setVisible(false);
                        this.getView().byId("cash_purchase_table").setVisible(false);
                        this.getView().byId("sales_return_table").setVisible(false);
                        this.getView().byId("in_returnable_challan_table").setVisible(false);
                        this.getView().byId("vendor_return_table").setVisible(false);
                        this.getView().byId("out_returnable_challan_table").setVisible(true);
                        this.getView().byId("subcontracting_vendor_table").setVisible(false);
                        this.getView().byId("sales_sto_table").setVisible(false);
                        this.getView().byId("inword_sales_sto_table").setVisible(false); //dsdsdsdsdsdsdsd

                        this.getView().byId("Ref_Data01").setValue("2");
                    
                    }
                    else if (Get_enter_gate_pass_No === "20004"){ // For Enter Subcontracting Vendor
                        var model0 = this.getOwnerComponent().getModel("YY1_SUBCONTRACTING_VENDOR_CDS");
                        var EntitySet = "/YY1_ITEMS_SUBCONTRACTING_VENDO";
                        var oFilter = new sap.ui.model.Filter("Id", sap.ui.model.FilterOperator.EQ, enter_gate_pass_No);
                            if(from_date !== "_" && to_date !== "_"){
                                var BTDateFilter = new sap.ui.model.Filter("Posting_Date", "BT", from_date, to_date);
                                var oFilters = [oFilter, BTDateFilter];
                            }else if( from_date !== "_" && to_date === "_"){
                                var BTDateFilter = new sap.ui.model.Filter("Posting_Date", "Contains", from_date);
                                var oFilters = [oFilter, BTDateFilter];
                            }else if( from_date === "_" && to_date !== "_"){
                                var BTDateFilter = new sap.ui.model.Filter("Posting_Date", "Contains", to_date); 
                                var oFilters = [oFilter, BTDateFilter];
                            }else if( from_date === "_" && to_date ==="_"){
                                var oFilters = [oFilter];
                            }
                        this.getView().byId("general_purchase_table").setVisible(false);
                        this.getView().byId("cash_purchase_table").setVisible(false);
                        this.getView().byId("sales_return_table").setVisible(false);
                        this.getView().byId("in_returnable_challan_table").setVisible(false);
                        this.getView().byId("vendor_return_table").setVisible(false);
                        this.getView().byId("out_returnable_challan_table").setVisible(false);
                        this.getView().byId("subcontracting_vendor_table").setVisible(true);
                        this.getView().byId("sales_sto_table").setVisible(false);
                        this.getView().byId("inword_sales_sto_table").setVisible(false); //dsdsdsdsdsdsdsd

                        this.getView().byId("Ref_Data01").setValue("2");
                    
                    }
                    else if (Get_enter_gate_pass_No === "20001"){ // For Enter Sales STO No
                        var model0 = this.getOwnerComponent().getModel("YY1_SALES_STO_CDS");
                        var EntitySet = "/YY1_ITEM_SALES_STO";
                        var oFilter = new sap.ui.model.Filter("Id", sap.ui.model.FilterOperator.EQ, enter_gate_pass_No);
                            if(from_date !== "_" && to_date !== "_"){
                                var BTDateFilter = new sap.ui.model.Filter("Posting_Date", "BT", from_date, to_date);
                                var oFilters = [oFilter, BTDateFilter];
                            }else if( from_date !== "_" && to_date === "_"){
                                var BTDateFilter = new sap.ui.model.Filter("Posting_Date", "Contains", from_date);
                                var oFilters = [oFilter, BTDateFilter];
                            }else if( from_date === "_" && to_date !== "_"){
                                var BTDateFilter = new sap.ui.model.Filter("Posting_Date", "Contains", to_date); 
                                var oFilters = [oFilter, BTDateFilter];
                            }else if( from_date === "_" && to_date ==="_"){
                                var oFilters = [oFilter];
                            }
                        this.getView().byId("general_purchase_table").setVisible(false);
                        this.getView().byId("cash_purchase_table").setVisible(false);
                        this.getView().byId("sales_return_table").setVisible(false);
                        this.getView().byId("in_returnable_challan_table").setVisible(false);
                        this.getView().byId("vendor_return_table").setVisible(false);
                        this.getView().byId("out_returnable_challan_table").setVisible(false);
                        this.getView().byId("subcontracting_vendor_table").setVisible(false);
                        this.getView().byId("sales_sto_table").setVisible(true);
                        this.getView().byId("inword_sales_sto_table").setVisible(false); //dsdsdsdsdsdsdsd

                        this.getView().byId("Ref_Data01").setValue("2");
                    
                    }
                }

                var that = this;
                model0.read(""+EntitySet+"", {
                    filters: oFilters,
                    success: function (oData, oRespons) {
                        console.log("------------------------Json COunt===========");
                        console.log("COunt="+ oData.results.length);
                        that.getView().byId("Ref_Export_Count01").setValue(oData.results.length);
                        console.log("------------------------Json COunt===========");
                        var oJSONModel = new sap.ui.model.json.JSONModel({
                            data: oData.results
                        });
                        that.getView().setModel(oJSONModel, "JModel");

                        var ModelCount = new sap.ui.model.json.JSONModel({
                            data: {
                                DataCount:oData.results.length,
                            }
                        });
                        that.getView().setModel(ModelCount, "JModelCount");
                        console.log(oJSONModel);
                        console.log(ModelCount);
                        that._pBusyDialog.close();
                    }
                });
            },

            OnBack:function(){
                this.getView().getModel("JModel").setData({});
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			        oRouter.navTo("header_gatepass_report");

            },

            openPersoDialog: function () {
                var oTable = this.byId("general_purchase_table");
                var oP13nEngine = new sap.m.p13n.P13nEngine();
                
                // Show the personalization dialog for column visibility
                oP13nEngine.show(oTable, ["Columns"], {
                    dialogTitle: "Column Visibility Settings",
                    persistencyKey: "your_persistency_key"
                });
            },
            

            // OnSelect: function () {
            //     var oTable = this.byId("general_purchase_table");
            //     oTable.selectAll();
            
            //     var aSelectedIndices = oTable.getSelectedIndices();
            
            //     if (aSelectedIndices.length === 0) {
            //         // No rows are selected
            //         return;
            //     }
            
            //     var aSelectedData = aSelectedIndices.map(function (index) {
            //         var oRow = oTable.getContextByIndex(index);
            //         var oModel = oRow.getModel();
            //         var oRowData = oModel.getProperty(oRow.getPath());
            
            //         // Assuming each cell value is a property in the row data object
            //         return Object.values(oRowData);
            //     });
            
            //     // aSelectedData now contains an array of arrays, where each inner array represents the values of the selected row's cells.
            //     console.log(aSelectedData);
            // },
            
            
            

            onColumnMove: function(oEvt) {
                var oTable = this.byId("general_purchase_table");
                var oAffectedColumn = oEvt.getParameter("column");
                var iNewPos = oEvt.getParameter("newPos");
                var sKey = this._getKey(oAffectedColumn);
                oEvt.preventDefault();
    
                Engine.getInstance().retrieveState(oTable).then(function(oState){
    
                    var oCol = oState.Columns.find(function(oColumn) {
                        return oColumn.key === sKey;
                    }) || {key: sKey};
                    oCol.position = iNewPos;
    
                    Engine.getInstance().applyState(oTable, {Columns: [oCol]});
                });
            },
    
            _getKey: function(oControl) {
                return this.getView().getLocalId(oControl.getId());
            },


// =========================================____ Start FORMATTER Functions ___=====================================================//


            // ______________________ Start FORMATTER CODE - FOR "CreatedAt"_________________________//

            OnCreatedAt:function(SAP_PARENT_UUID, Id){
                var that= this;

                if(SAP_PARENT_UUID !== "" || SAP_PARENT_UUID !== null){
                    var ValueId = that.getView().byId("Ref_Data01").getValue();

                    return new Promise(function(resolve, reject) {

                        if(ValueId === "0"){ // General Purchase Formatter / oData Model
                            var model_F = that.getView().getModel("YY1_GENERAL_PURCHASE_CDS");
                            var EntitySet01 = "/YY1_GENERAL_PURCHASE";
                            var oFilter = new sap.ui.model.Filter("SAP_UUID", sap.ui.model.FilterOperator.EQ, SAP_PARENT_UUID);
                            var oFilters = [oFilter];   
                            
                            model_F.read(""+EntitySet01+"", {
                                filters: oFilters,
                                success: function (ODat, oRespons) {
                                    console.log(ODat);
                                    var value11 = ODat.results[0];
                                    var CreatedAt = value11.SAP_CreatedDateTime;

                                    const date = new Date(CreatedAt);
                                    // Format the date using SAPUI5's DateFormat class
                                    const oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
                                    pattern: "yyyy-MM-dd HH:mm:ss" // Define the desired output format
                                    });
                                    const formattedDate = oDateFormat.format(date);
                                    resolve(formattedDate); // Resolve with the data
                                },
                                error: function(oError) {
                                    console.error("Error reading data: ", oError);
                                    reject(oError); // Reject with the error
                                }
                            });
        
                        } 
                        else if(ValueId === "1"){ // Cash Purchase Formatter / oData Model
                            var model_F = that.getView().getModel("YY1_CASH_PURCHASE_CDS");
                            var EntitySet01 = "/YY1_CASH_PURCHASE";
                            var oFilter = new sap.ui.model.Filter("SAP_UUID", sap.ui.model.FilterOperator.EQ, SAP_PARENT_UUID);
                            var oFilters = [oFilter];   
                            
                            model_F.read(""+EntitySet01+"", {
                                filters: oFilters,
                                success: function (ODat, oRespons) {
                                    console.log(ODat);
                                    var value11 = ODat.results[0];
                                    var CreatedAt = value11.SAP_CreatedDateTime;
        
                                    const date = new Date(CreatedAt);

                                    // Format the date using SAPUI5's DateFormat class
                                    const oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
                                    pattern: "yyyy-MM-dd HH:mm:ss" // Define the desired output format
                                    });
                                    const formattedDate = oDateFormat.format(date);
                                    resolve(formattedDate); // Resolve with the data
                                },
                                error: function(oError) {
                                    console.error("Error reading data: ", oError);
                                    reject(oError); // Reject with the error
                                }
                            });
        
                        }
                        else if(ValueId === "2"){ // Sales Return Formatter / oData Model
                            var model_F = that.getView().getModel("YY1_SALES_RETURN_CDS");
                            var EntitySet01 = "/YY1_SALES_RETURN";
                            var oFilter = new sap.ui.model.Filter("SAP_UUID", sap.ui.model.FilterOperator.EQ, SAP_PARENT_UUID);
                            var oFilters = [oFilter];   
                            
                            model_F.read(""+EntitySet01+"", {
                                filters: oFilters,
                                success: function (ODat, oRespons) {
                                    console.log(ODat);
                                    var value11 = ODat.results[0];
                                    var CreatedAt = value11.SAP_CreatedDateTime;
        
                                    const date = new Date(CreatedAt);

                                    // Format the date using SAPUI5's DateFormat class
                                    const oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
                                    pattern: "yyyy-MM-dd HH:mm:ss" // Define the desired output format
                                    });
                                    const formattedDate = oDateFormat.format(date);
                                    resolve(formattedDate); // Resolve with the data
                                },
                                error: function(oError) {
                                    console.error("Error reading data: ", oError);
                                    reject(oError); // Reject with the error
                                }
                            });
        
                        }
                    });
    
                }
              
            },

            // ______________________ End FORMATTER CODE - FOR "CreatedAt"_________________________//


            // ______________________ Start FORMATTER CODE - FOR "CreatedBy"_________________________//

            OnCreatedBy:function(SAP_PARENT_UUID, Id){
                var that= this;

                if(SAP_PARENT_UUID !== "" || SAP_PARENT_UUID !== null){
                    var ValueId = that.getView().byId("Ref_Data01").getValue();

                    return new Promise(function(resolve, reject) {

                        if(ValueId === "0"){ // General Purchase Formatter / oData Model
                            var model_F = that.getView().getModel("YY1_GENERAL_PURCHASE_CDS");
                            var EntitySet01 = "/YY1_GENERAL_PURCHASE";
                            var oFilter = new sap.ui.model.Filter("SAP_UUID", sap.ui.model.FilterOperator.EQ, SAP_PARENT_UUID);
                            var oFilters = [oFilter];   
                            
                            model_F.read(""+EntitySet01+"", {
                                filters: oFilters,
                                success: function (ODat, oRespons) {
                                    console.log(ODat);
                                    var value11 = ODat.results[0];
                                    var CreatedAt = value11.SAP_CreatedByUser_Text;
        
                                    resolve(CreatedAt); // Resolve with the data
                                },
                                error: function(oError) {
                                    console.error("Error reading data: ", oError);
                                    reject(oError); // Reject with the error
                                }
                            });
        
                        } 
                        else if(ValueId === "1"){ // Cash Purchase Formatter / oData Model
                            var model_F = that.getView().getModel("YY1_CASH_PURCHASE_CDS");
                            var EntitySet01 = "/YY1_CASH_PURCHASE";
                            var oFilter = new sap.ui.model.Filter("SAP_UUID", sap.ui.model.FilterOperator.EQ, SAP_PARENT_UUID);
                            var oFilters = [oFilter];   
                            
                            model_F.read(""+EntitySet01+"", {
                                filters: oFilters,
                                success: function (ODat, oRespons) {
                                    console.log(ODat);
                                    var value11 = ODat.results[0];
                                    var CreatedAt = value11.SAP_CreatedByUser_Text;
        
                                    resolve(CreatedAt); // Resolve with the data
                                },
                                error: function(oError) {
                                    console.error("Error reading data: ", oError);
                                    reject(oError); // Reject with the error
                                }
                            });
        
                        }
                        else if(ValueId === "2"){ // Sales Return Formatter / oData Model
                            var model_F = that.getView().getModel("YY1_SALES_RETURN_CDS");
                            var EntitySet01 = "/YY1_SALES_RETURN";
                            var oFilter = new sap.ui.model.Filter("SAP_UUID", sap.ui.model.FilterOperator.EQ, SAP_PARENT_UUID);
                            var oFilters = [oFilter];   
                            
                            model_F.read(""+EntitySet01+"", {
                                filters: oFilters,
                                success: function (ODat, oRespons) {
                                    console.log(ODat);
                                    var value11 = ODat.results[0];
                                    var CreatedAt = value11.SAP_CreatedByUser_Text;
        
                                    resolve(CreatedAt); // Resolve with the data
                                },
                                error: function(oError) {
                                    console.error("Error reading data: ", oError);
                                    reject(oError); // Reject with the error
                                }
                            });
        
                        }
                    });
    
                }
              
            },

            // ______________________ End FORMATTER CODE - FOR "CreatedBy"_________________________//

            // ______________________ Start FORMATTER CODE - FOR "ChangedAt"_________________________//

            OnChangedAt:function(SAP_PARENT_UUID, Id){
                var that= this;

                if(SAP_PARENT_UUID !== "" || SAP_PARENT_UUID !== null){
                    var ValueId = that.getView().byId("Ref_Data01").getValue();

                    return new Promise(function(resolve, reject) {

                        if(ValueId === "0"){ // General Purchase Formatter / oData Model
                            var model_F = that.getView().getModel("YY1_GENERAL_PURCHASE_CDS");
                            var EntitySet01 = "/YY1_GENERAL_PURCHASE";
                            var oFilter = new sap.ui.model.Filter("SAP_UUID", sap.ui.model.FilterOperator.EQ, SAP_PARENT_UUID);
                            var oFilters = [oFilter];   
                            
                            model_F.read(""+EntitySet01+"", {
                                filters: oFilters,
                                success: function (ODat, oRespons) {
                                    console.log(ODat);
                                    var value11 = ODat.results[0];
                                    var CreatedAt = value11.SAP_LastChangedDateTime;
        
                                    const date = new Date(CreatedAt);

                                    // Format the date using SAPUI5's DateFormat class
                                    const oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
                                    pattern: "yyyy-MM-dd HH:mm:ss" // Define the desired output format
                                    });
                                    const formattedDate = oDateFormat.format(date);
                                    resolve(formattedDate); // Resolve with the data
                                },
                                error: function(oError) {
                                    console.error("Error reading data: ", oError);
                                    reject(oError); // Reject with the error
                                }
                            });
        
                        } 
                        else if(ValueId === "1"){ // Cash Purchase Formatter / oData Model
                            var model_F = that.getView().getModel("YY1_CASH_PURCHASE_CDS");
                            var EntitySet01 = "/YY1_CASH_PURCHASE";
                            var oFilter = new sap.ui.model.Filter("SAP_UUID", sap.ui.model.FilterOperator.EQ, SAP_PARENT_UUID);
                            var oFilters = [oFilter];   
                            
                            model_F.read(""+EntitySet01+"", {
                                filters: oFilters,
                                success: function (ODat, oRespons) {
                                    console.log(ODat);
                                    var value11 = ODat.results[0];
                                    var CreatedAt = value11.SAP_LastChangedDateTime;
        
                                    const date = new Date(CreatedAt);

                                    // Format the date using SAPUI5's DateFormat class
                                    const oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
                                    pattern: "yyyy-MM-dd HH:mm:ss" // Define the desired output format
                                    });
                                    const formattedDate = oDateFormat.format(date);
                                    resolve(formattedDate); // Resolve with the data
                                },
                                error: function(oError) {
                                    console.error("Error reading data: ", oError);
                                    reject(oError); // Reject with the error
                                }
                            });
        
                        }
                        else if(ValueId === "2"){ // Sales Return Formatter / oData Model
                            var model_F = that.getView().getModel("YY1_SALES_RETURN_CDS");
                            var EntitySet01 = "/YY1_SALES_RETURN";
                            var oFilter = new sap.ui.model.Filter("SAP_UUID", sap.ui.model.FilterOperator.EQ, SAP_PARENT_UUID);
                            var oFilters = [oFilter];   
                            
                            model_F.read(""+EntitySet01+"", {
                                filters: oFilters,
                                success: function (ODat, oRespons) {
                                    console.log(ODat);
                                    var value11 = ODat.results[0];
                                    var CreatedAt = value11.SAP_LastChangedDateTime;
        
                                    const date = new Date(CreatedAt);

                                    // Format the date using SAPUI5's DateFormat class
                                    const oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
                                    pattern: "yyyy-MM-dd HH:mm:ss" // Define the desired output format
                                    });
                                    const formattedDate = oDateFormat.format(date);
                                    resolve(formattedDate); // Resolve with the data
                                },
                                error: function(oError) {
                                    console.error("Error reading data: ", oError);
                                    reject(oError); // Reject with the error
                                }
                            });
        
                        }
                    });
    
                }
              
            },

            // ______________________ End FORMATTER CODE - FOR "ChangedAt"_________________________//

            // ______________________ Start FORMATTER CODE - FOR "ChangedBy"_________________________//

            OnChangedBy:function(SAP_PARENT_UUID, Id){
                var that= this;

                if(SAP_PARENT_UUID !== "" || SAP_PARENT_UUID !== null){
                    var ValueId = that.getView().byId("Ref_Data01").getValue();

                    return new Promise(function(resolve, reject) {

                        if(ValueId === "0"){ // General Purchase Formatter / oData Model
                            var model_F = that.getView().getModel("YY1_GENERAL_PURCHASE_CDS");
                            var EntitySet01 = "/YY1_GENERAL_PURCHASE";
                            var oFilter = new sap.ui.model.Filter("SAP_UUID", sap.ui.model.FilterOperator.EQ, SAP_PARENT_UUID);
                            var oFilters = [oFilter];   
                            
                            model_F.read(""+EntitySet01+"", {
                                filters: oFilters,
                                success: function (ODat, oRespons) {
                                    console.log(ODat);
                                    var value11 = ODat.results[0];
                                    var CreatedAt = value11.SAP_LastChangedByUser_Text;
        
                                    resolve(CreatedAt); // Resolve with the data
                                },
                                error: function(oError) {
                                    console.error("Error reading data: ", oError);
                                    reject(oError); // Reject with the error
                                }
                            });
        
                        } 
                        else if(ValueId === "1"){ // Cash Purchase Formatter / oData Model
                            var model_F = that.getView().getModel("YY1_CASH_PURCHASE_CDS");
                            var EntitySet01 = "/YY1_CASH_PURCHASE";
                            var oFilter = new sap.ui.model.Filter("SAP_UUID", sap.ui.model.FilterOperator.EQ, SAP_PARENT_UUID);
                            var oFilters = [oFilter];   
                            
                            model_F.read(""+EntitySet01+"", {
                                filters: oFilters,
                                success: function (ODat, oRespons) {
                                    console.log(ODat);
                                    var value11 = ODat.results[0];
                                    var CreatedAt = value11.SAP_LastChangedByUser_Text;
        
                                    resolve(CreatedAt); // Resolve with the data
                                },
                                error: function(oError) {
                                    console.error("Error reading data: ", oError);
                                    reject(oError); // Reject with the error
                                }
                            });
        
                        }
                        else if(ValueId === "2"){ // Sales Return Formatter / oData Model
                            var model_F = that.getView().getModel("YY1_SALES_RETURN_CDS");
                            var EntitySet01 = "/YY1_SALES_RETURN";
                            var oFilter = new sap.ui.model.Filter("SAP_UUID", sap.ui.model.FilterOperator.EQ, SAP_PARENT_UUID);
                            var oFilters = [oFilter];   
                            
                            model_F.read(""+EntitySet01+"", {
                                filters: oFilters,
                                success: function (ODat, oRespons) {
                                    console.log(ODat);
                                    var value11 = ODat.results[0];
                                    var CreatedAt = value11.SAP_LastChangedByUser_Text;
        
                                    resolve(CreatedAt); // Resolve with the data
                                },
                                error: function(oError) {
                                    console.error("Error reading data: ", oError);
                                    reject(oError); // Reject with the error
                                }
                            });
        
                        }
                    });
    
                }
              
            },

            // ______________________ End FORMATTER CODE - FOR "CreatedBy"_________________________//

// ["Id","Purchasing_Document_Item","Purchasing_Document","Quantity","Gate_Entry_Received","GR_Received_Quantity","Gate_Pending_Quantity","Gate_Quantity_To_Post","UOM","HSN_Code","GST_No","Net_Price","Material_Code","Material_Description","Plant","Vendor_Code","Vendor_Name","No_Of_Packages","Vehicle_No","Bins","No_Of_Bins","Invoice_Date","Transporter","EWayBill","Status","Status01"]


// =========================================____ End FORMATTER Functions ___=====================================================//

// =========================================____ Export to Excel Code _____======================================================//

OnExport: function () {

    var Ref_Data01 = this.getView().byId("Ref_Data01").getValue();

    if(Ref_Data01 === "0"){ // For General Purchase Table
        var TableId1 = this.getView().byId("general_purchase_table");
        var TableHeaderData = ["Document No", "Purchasing Document No", "Purchasing Document No", "Material Code", "Material Description", "Quantity", "UOM", "HSN Code", "Net Price", "Plant", "Vendor Code", "Vendor Name", "Invoice No", "Invoice Date", "No Of Packages", "Vehicle No", "Bins", "No Of Bins", "Created At", "Created By", "Changed At", "Changed By"]
    }else if(Ref_Data01 === "1"){ // For Cash Purchase Table
        var TableId1 = this.getView().byId("cash_purchase_table");
        var TableHeaderData =["Document No", "Material Description", "Quantity", "Amount", "Bill No", "Partner Document No", "Vendor Name", "No Of Packages", "Vehicle No", "Bins", "No Of Bins", "Person Name", "Created At", "Created By", "Changed At", "Changed By"]
    }else if(Ref_Data01 === "2"){ // For Sales Return Table
        var TableId1 = this.getView().byId("sales_return_table");
        var TableHeaderData =["Document No", "Sales Order Item", "Sales Order", "Material Code", "Material Description", "Quantity", "Plant", "Customer Code", "Customer Name", "No Of Packages", "Vehicle No", "Bins", "No Of Bins", "Transporter", "Created At", "Created By", "Changed At", "Changed By"]
    }

    /*Get Table Items*/

    var uri = 'data:application/vnd.ms-excel;base64,',
        tmplWorkbookXML =
        '<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">' +
        '<DocumentProperties xmlns="urn:schemas-microsoft-com:office:office"><Author>Axel Richter</Author><Created>{created}</Created></DocumentProperties>' +
        '<Styles>' + '<Style ss:ID="Currency"><NumberFormat ss:Format="Currency"></NumberFormat></Style>' +
        '<Style ss:ID="Date"><NumberFormat ss:Format="Medium Date"></NumberFormat></Style>' + '</Styles>' + '{worksheets}</Workbook>',
        tmplWorksheetXML = '<Worksheet ss:Name="{nameWS}"><Table>{rows}</Table></Worksheet>',
        tmplCellXML = '<Cell{attributeStyleID}{attributeFormula}><Data ss:Type="{nameType}">{data}</Data></Cell>',
        base64 = function (s) {
            return window.btoa(unescape(encodeURIComponent(s)));
        },
        format = function (s, c) {
            return s.replace(/{(\w+)}/g, function (m, p) {
                return c[p];
            });
        };

        // return function (tables, wsnames, wbname, appname) {
    var ctx = "";
    var workbookXML = "";
    var worksheetsXML = "";
    var rowsXML = "";

            // var TableId1 = this.getView().byId("general_purchase_table");

        var aItems1 = TableId1.getRows();
        var aItems = TableId1.getRows().length;
        console.log("=======aItems");
        console.log(aItems);
        

        
            for (var j = 0; j < 1; j++) {
                    rowsXML += '<Row>';
                    for (let l=0; l < TableHeaderData.length; l++){
                        var dataType = "H";
                        var dataStyle = "";
                        var dataValue = "";
                        dataValue = (dataValue) ? dataValue : TableHeaderData[l];
                        // dataValue = (dataValue) ? dataValue : TableId1.getRows()[j].getCells()[k].getValue();
                        var dataFormula = "";
                        ctx = {
                            attributeStyleID: (dataStyle == 'Currency' || dataStyle == 'Date') ? ' ss:StyleID="' + dataStyle + '"' : '',
                            nameType: (dataType == 'Number' || dataType == 'DateTime' || dataType == 'Boolean' || dataType == 'String' || dataType == 'String' || dataType == 'Error') ? dataType : 'String',
                            data: (dataFormula) ? '' : dataValue,
                            attributeFormula: (dataFormula) ? ' ss:Formula="' + dataFormula + '"' : ''
                        };
                        rowsXML += format(tmplCellXML, ctx);
                    }
                    rowsXML += '</Row>';

                    break;            
                }

        // console.log(aItems1.getBindingContext());

        // 	if (!tables[i].nodeType) tables[i] = document.getElementById(tables[i]);
        // ------------------------------------
        for (var j = 0; j < aItems; j++) {
            rowsXML += '<Row>';
            for (var k = 0; k < TableHeaderData.length; k++) {
                var dataType = "H";
                var dataStyle = "";
                var dataValue = "";
                // dataValue = (dataValue) ? dataValue : HeaderData[k];
                dataValue = (dataValue) ? dataValue : TableId1.getRows()[j].getCells()[k].getValue();
                // dataValue = (dataValue) ? dataValue : TableId1.getRows()[j].getBindingContext().getProperty("PurchaseOrderItem");;
                var dataFormula = "";
                ctx = {
                    attributeStyleID: (dataStyle == 'Currency' || dataStyle == 'Date') ? ' ss:StyleID="' + dataStyle + '"' : '',
                    nameType: (dataType == 'Number' || dataType == 'DateTime' || dataType == 'Boolean' || dataType == 'String' || dataType == 'String' || dataType == 'Error') ? dataType : 'String',
                    data: (dataFormula) ? '' : dataValue,
                    attributeFormula: (dataFormula) ? ' ss:Formula="' + dataFormula + '"' : ''
                };
                rowsXML += format(tmplCellXML, ctx);
            }
            rowsXML += '</Row>';
        }
        // -------------------------------------------------------------------------
        ctx = {
            rows: rowsXML,
            nameWS: 'Sheet'
        };
        worksheetsXML += format(tmplWorksheetXML, ctx);
        rowsXML = "";
    

    ctx = {
        created: (new Date()).getTime(),
        worksheets: worksheetsXML
    };
    workbookXML = format(tmplWorkbookXML, ctx);

    console.log(workbookXML);

    var link = document.createElement("A");
    link.href = uri + base64(workbookXML);
    link.download = 'Gate Pass Report.xls';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // }
    // ();

    // var Results = [
    // 	["Col1", "Col2", "Col3", "Col4"],
    // 	["Data", 50, 100, 500],
    // 	["Data", -100, 20, 100],
    // ];

    // var CsvString = "";
    // Results.forEach(function (RowItem, RowIndex) {
    // 	RowItem.forEach(function (ColItem, ColIndex) {
    // 		CsvString += ColItem + ',';
    // 	});
    // 	CsvString += "\r\n";
    // });
    // window.open('data:application/vnd.ms-excel,' + encodeURIComponent(CsvString));

    // var Results = [
    // 	["Col1", "Col2", "Col3", "Col4"],
    // 	["K", 50, 100, ""],
    // 	["I", -100, 20, 100],
    // 	["R", -100, 20, 100],
    // ];

    // // exportToCsv = function () {
    // var CsvString = "";
    // Results.forEach(function (RowItem, RowIndex) {
    // 	RowItem.forEach(function (ColItem, ColIndex) {
    // 		CsvString += ColItem + ',';
    // 	});
    // 	CsvString += "\r\n";
    // });
    // window.open('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8,' + encodeURIComponent(CsvString));
    // // CsvString = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8," + encodeURIComponent(CsvString);
    // var x = document.createElement("A");
    // x.setAttribute("href", CsvString);
    // x.setAttribute("download.xls");
    // document.body.appendChild(x);
    // x.click();
    // }

    // };
    // var ArrayTableId = ["itemtableid", "itemtableid1"];
    // var ArrayTableType = ["Moment Type - 101", "Moment Type - 601"];
    // for (var i = 0; i < ArrayTableId.length; i++) {

    // 	TableToExcel.convert(document.getElementById("container-DISPATCH_REPORT---View1--itemtableid-listUl"), {
    // 		name: "Gateout.xlsx",

    // 		sheet: {
    // 			name: ArrayTableType[i]
    // 		}

    // 	});
    // }

},

        });
    });
