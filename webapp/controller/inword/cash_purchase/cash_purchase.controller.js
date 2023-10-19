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

        return Controller.extend("gatepass.controller.inword.cash_pruchase.cash_pruchase", {
            onInit: function () {

                this.getOwnerComponent().getModel("YY1_CASH_PURCHASE_CDS").read("/YY1_CASH_PURCHASE/$count", { /* Decalure Globally in the Create table Serial Number */
				success: $.proxy(function (oEvent, oResponse) {
                    let Count = Number(oResponse.body) + 1; // This should be a number, no need to use Number()
                    let CountLen = Count.toString(); // Convert to string to get its length
                    let AddData = "10001";
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

                this.Header_Status = "200";


                let plantValue = this.getView().byId("Plant_H").getValue();

                this.mModel = new sap.ui.model.json.JSONModel({
                    Samples : [{
                        Plant:plantValue, 
                        Bill_No:"" , 
                        Vendor:"" , 
                        Material_description:"" , 
                        Amount:"" , 
                        Quantity:"" , 
                        BaseUnit:"" , 
                        No_of_Packages:"" , 
                        Vehicle_No:"" ,
                        Person_name:"",
                        Check_In_date: "",
                        Check_in_time: "",
                        
                    }]	
                    });
            this.getView().setModel(this.mModel, "mModel");
        
            },

            OnBack: function(oEvent){
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("View1");
            },

            OnEditPage:function(){
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			        oRouter.navTo("edit_cash_purchase");
            },

            OnDisplay : function(oEvent){
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("header_gatepass_report");
            },

            OnTableAddRow:function(oEvent){
                var tabledata = this.getView().getModel("mModel").getProperty("/Samples");
			    this.count = this.count + 1;
                let plantValue = this.getView().byId("Plant_H").getValue();
                let PartnerDocNo_H = this.getView().byId("PartnerDocNo_H").getValue();
                let Vendor_H = this.getView().byId("Vendor_H").getValue();
                let NoOfPackage = this.getView().byId("NoOfPackage_H").getValue();
                let VehicleNo = this.getView().byId("VehicleNo_H").getValue();
                let PersonName = this.getView().byId("PersonName_H").getValue();

			var datas = {
                        Plant:plantValue, 
                        Bill_No:PartnerDocNo_H, 
                        Vendor:Vendor_H, 
                        Material_description:"" , 
                        Amount:"" , 
                        Quantity:"" , 
                        BaseUnit:"" , 
                        No_of_Packages:NoOfPackage, 
                        Vehicle_No:VehicleNo,
                        Person_name:PersonName,
                        Check_In_date: "",
                        Check_in_time: "",
			};

			tabledata.push(datas);
			this.mModel.refresh();

            },

            OnTableRowRemove: function (oEvent) { 
			var del = oEvent.getSource().getBindingContext("mModel").getObject();
			var mod = this.getView().getModel("mModel");
			var data = mod.getProperty("/Samples");

			for (var i = 0; i < data.length; i++) {
				if (data[i] === del) {
					data.splice(i, 1);
					this.count = this.count - 1;
					mod.setProperty("/Samples", data);
					mod.refresh();

					break;
				}
			}

			var table_id = this.getView().byId("cashTable");
			for (var j = 0; j < data.length; j++) {
				table_id.getItems()[j].getCells()[0].setValue(j + 1);
			}

		},

        // ------------ Plant Fragment Open Start --------------------
        
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
            var Plant;

            if (aContexts && aContexts.length) {

                aContexts.map(function (oContext) {
                    Plant = oContext.getObject().Plant;
                    return;
                });
                this.byId("Plant_H").setValue(Plant);
            }

            let PlantVal = this.getView().byId("Plant_H").getValue();
            let VendorVal = this.getView().byId("Vendor_H").getValue();
            let PartnerDocNoVal = this.getView().byId("PartnerDocNo_H").getValue();

            if(PlantVal !=="" && VendorVal !=="" && PartnerDocNoVal !=="" ){
                this.getView().byId("TableAddRowBtn").setEnabled(true);
                this.getView().byId("cashTable").setVisible(true);
                this.getView().byId("Final_Save_Button").setVisible(true);
            }else{
                this.getView().byId("TableAddRowBtn").setEnabled(false);
                this.getView().byId("cashTable").setVisible(false);
                this.getView().byId("Final_Save_Button").setVisible(false);
            }

            let PartnerDocNo_H = this.getView().byId("PartnerDocNo_H").getValue();
            let NoOfPackage = this.getView().byId("NoOfPackage_H").getValue();
            let VehicleNo = this.getView().byId("VehicleNo_H").getValue();
            let PersonName = this.getView().byId("PersonName_H").getValue();

            var oTable = this.byId("cashTable");
            var aRows = oTable.getRows();
        
            var oModel = this.getView().getModel("mModel");
            var aSamples = oModel.getProperty("/Samples");
        
            for (var i = 0; i < aSamples.length; i++) {
                aSamples[i].Plant = PlantVal;
                aSamples[i].Bill_No = PartnerDocNo_H;
                aSamples[i].Vendor = VendorVal;
                aSamples[i].No_of_Packages = NoOfPackage;
                aSamples[i].Vehicle_No = VehicleNo;
                aSamples[i].Person_name = PersonName;
            }
        
            oModel.refresh();

        },

        OnPartnerDocNo:function(){
            let PlantVal = this.getView().byId("Plant_H").getValue();
            let VendorVal = this.getView().byId("Vendor_H").getValue();
            let PartnerDocNoVal = this.getView().byId("PartnerDocNo_H").getValue();

            let PartnerDocNo_H = this.getView().byId("PartnerDocNo_H").getValue();
            let NoOfPackage = this.getView().byId("NoOfPackage_H").getValue();
            let VehicleNo = this.getView().byId("VehicleNo_H").getValue();
            let PersonName = this.getView().byId("PersonName_H").getValue();

            var oTable = this.byId("cashTable");
            var aRows = oTable.getRows();
        
            var oModel = this.getView().getModel("mModel");
            var aSamples = oModel.getProperty("/Samples");
        
            for (var i = 0; i < aSamples.length; i++) {
                aSamples[i].Plant = PlantVal;
                aSamples[i].Bill_No = PartnerDocNo_H;
                aSamples[i].Vendor = VendorVal;
                aSamples[i].No_of_Packages = NoOfPackage;
                aSamples[i].Vehicle_No = VehicleNo;
                aSamples[i].Person_name = PersonName;
            }
        
            oModel.refresh();

            if(PlantVal !=="" && VendorVal !=="" && PartnerDocNoVal !=="" ){
                this.getView().byId("TableAddRowBtn").setEnabled(true);
                this.getView().byId("cashTable").setVisible(true);
                this.getView().byId("Final_Save_Button").setVisible(true);
            }else{
                this.getView().byId("TableAddRowBtn").setEnabled(false);
                this.getView().byId("cashTable").setVisible(false);
                this.getView().byId("Final_Save_Button").setVisible(false);
            }
        },

        OnOverallHeader:function(){
            let PlantVal = this.getView().byId("Plant_H").getValue();
            let VendorVal = this.getView().byId("Vendor_H").getValue();
            let PartnerDocNoVal = this.getView().byId("PartnerDocNo_H").getValue();

            let PartnerDocNo_H = this.getView().byId("PartnerDocNo_H").getValue();
            let NoOfPackage = this.getView().byId("NoOfPackage_H").getValue();
            let VehicleNo = this.getView().byId("VehicleNo_H").getValue();
            let PersonName = this.getView().byId("PersonName_H").getValue();

            var oTable = this.byId("cashTable");
            var aRows = oTable.getRows();
        
            var oModel = this.getView().getModel("mModel");
            var aSamples = oModel.getProperty("/Samples");
        
            for (var i = 0; i < aSamples.length; i++) {
                aSamples[i].Plant = PlantVal;
                aSamples[i].Bill_No = PartnerDocNo_H;
                aSamples[i].Vendor = VendorVal;
                aSamples[i].No_of_Packages = NoOfPackage;
                aSamples[i].Vehicle_No = VehicleNo;
                aSamples[i].Person_name = PersonName;
            }
        
            oModel.refresh();

        },

        OnVendorHeadEnter:function(){
            let PlantVal = this.getView().byId("Plant_H").getValue();
            let VendorVal = this.getView().byId("Vendor_H").getValue();
            let PartnerDocNoVal = this.getView().byId("PartnerDocNo_H").getValue();

            let PartnerDocNo_H = this.getView().byId("PartnerDocNo_H").getValue();
            let NoOfPackage = this.getView().byId("NoOfPackage_H").getValue();
            let VehicleNo = this.getView().byId("VehicleNo_H").getValue();
            let PersonName = this.getView().byId("PersonName_H").getValue();

            var oTable = this.byId("cashTable");
            var aRows = oTable.getRows();
        
            var oModel = this.getView().getModel("mModel");
            var aSamples = oModel.getProperty("/Samples");
        
            for (var i = 0; i < aSamples.length; i++) {
                aSamples[i].Plant = PlantVal;
                aSamples[i].Bill_No = PartnerDocNo_H;
                aSamples[i].Vendor = VendorVal;
                aSamples[i].No_of_Packages = NoOfPackage;
                aSamples[i].Vehicle_No = VehicleNo;
                aSamples[i].Person_name = PersonName;
            }
        
            oModel.refresh();

            if(PlantVal !=="" && VendorVal !=="" && PartnerDocNoVal !=="" ){
                this.getView().byId("TableAddRowBtn").setEnabled(true);
                this.getView().byId("cashTable").setVisible(true);
                this.getView().byId("Final_Save_Button").setVisible(true);
            }else{
                this.getView().byId("TableAddRowBtn").setEnabled(false);
                this.getView().byId("cashTable").setVisible(false);
                this.getView().byId("Final_Save_Button").setVisible(false);
            }
        },

        // ------------ Supplier Fragment Open Start --------------------

        OnVendorFragOpen:function(oEvent){
            if (!this._dialog_supplierhead) {
                this._dialog_supplierhead = sap.ui.xmlfragment(this.getView().getId("Supplier_dialog"), "gatepass.view.fragments.Supplier", this);
                this.getView().addDependent(this._dialog_supplierhead);
            }

            this._dialog_supplierhead.open();
        },

        OnSupplierSearch: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter("BusinessPartnerName1", FilterOperator.Contains, sValue);
            var oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([oFilter]);
        },

        OnSupplierSelect : function (oEvent) {
            var oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([]);

            var aContexts = oEvent.getParameter("selectedContexts");
            console.log(aContexts)
            var Supplier;

            if (aContexts && aContexts.length) {

                aContexts.map(function (oContext) {
                    Supplier = oContext.getObject().BusinessPartnerName1;
                    return;
                });
                this.byId("Vendor_H").setValue(Supplier);
            }

            let PlantVal = this.getView().byId("Plant_H").getValue();
            let VendorVal = this.getView().byId("Vendor_H").getValue();
            let PartnerDocNoVal = this.getView().byId("PartnerDocNo_H").getValue();

            if(PlantVal !=="" && VendorVal !=="" && PartnerDocNoVal !=="" ){
                this.getView().byId("TableAddRowBtn").setEnabled(true);
                this.getView().byId("cashTable").setVisible(true);
                this.getView().byId("Final_Save_Button").setVisible(true);
            }else{
                this.getView().byId("TableAddRowBtn").setEnabled(false);
                this.getView().byId("Final_Save_Button").setVisible(false);
            }

            let PartnerDocNo_H = this.getView().byId("PartnerDocNo_H").getValue();
            let NoOfPackage = this.getView().byId("NoOfPackage_H").getValue();
            let VehicleNo = this.getView().byId("VehicleNo_H").getValue();
            let PersonName = this.getView().byId("PersonName_H").getValue();

            var oTable = this.byId("cashTable");
            var aRows = oTable.getRows();
        
            var oModel = this.getView().getModel("mModel");
            var aSamples = oModel.getProperty("/Samples");
        
            for (var i = 0; i < aSamples.length; i++) {
                aSamples[i].Plant = PlantVal;
                aSamples[i].Bill_No = PartnerDocNo_H;
                aSamples[i].Vendor = VendorVal;
                aSamples[i].No_of_Packages = NoOfPackage;
                aSamples[i].Vehicle_No = VehicleNo;
                aSamples[i].Person_name = PersonName;
            }
        
            oModel.refresh();

        },  
        
        // OnQuantityCheck:function(oEvent){
        //     let SAPUUID =  oEvent.getSource().getParent().getCells()[111].getValue(); 
        //     let ProductVal =  oEvent.getSource().getParent().getCells()[3].getValue(); 
            
        // },

        // OnAmountCheck:function(oEvent){
        //     let SAPUUID =  oEvent.getSource().getParent().getCells()[10].getValue(); 
        //     let ProductVal =  oEvent.getSource().getParent().getCells()[4].getValue(); 

        // },

        
        OnUOMCheck:function(oEvent){
            let DAtaa = oEvent.getSource().getParent().getCells()[3].getValue(); 
            let DAtaa01 = DAtaa.toUpperCase();
            oEvent.getSource().getParent().getCells()[3].setValue(DAtaa01); 
        },


        // ------------ Product Fragment Open Start --------------------

        OnProductFragOpen:function(oEvent){
            this.valueHelpIndex = oEvent.getSource().getParent();
            if (!this._dialog_producthead) {
                this._dialog_producthead = sap.ui.xmlfragment(this.getView().getId("Product_dialog"), "gatepass.view.fragments.Product", this);
                this.getView().addDependent(this._dialog_producthead);
            }

            this._dialog_producthead.open();
        },

        OnProductSearch: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter("Product", FilterOperator.Contains, sValue);
            var oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([oFilter]);
        },

        OnProductSelect : function (oEvent) {
            var oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([]);

            var aContexts = oEvent.getParameter("selectedContexts");
            console.log(aContexts)
            var UOM, ProductName;

            if (aContexts && aContexts.length) {

                aContexts.map(function (oContext) {
                    ProductName = oContext.getObject().ProductName;
                    UOM = oContext.getObject().BaseUnit;
                    return oContext;
                });
                this.valueHelpIndex.getCells()[1].setValue(ProductName);
                this.valueHelpIndex.getCells()[3].setValue(UOM);
            }

        }, 
                
        OnVendorFetch:function(datas){
            let Dataa = this.getView().byId("Plant_H").getValue();
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

               let Id = this.getView().byId("Id").getValue();
               let Plant_H = this.getView().byId("Plant_H").getValue();
               let Vendor_H = this.getView().byId("Vendor_H").getValue();
               let PartnerDocNo_H = this.getView().byId("PartnerDocNo_H").getValue();
               let NoOfPackage_H = this.getView().byId("NoOfPackage_H").getValue();
               let VehicleNo_H = this.getView().byId("VehicleNo_H").getValue();
               let PersonName_H = this.getView().byId("PersonName_H").getValue();

            console.log(Id);
            
            var Table_Id = this.getView().byId("cashTable"); // Assuming 'persoTable' is the ID of the Grid Table
            var oModel = Table_Id.getModel();
            var Table_Length = Table_Id.getRows().length;

            var itemData = [];
            var Plant_array = [];
            var Material_Desc_array = [];
            var Quantity_array = [];
            var UOM_array = [];
            var Amount_array = [];
            var Header_Status = "200";

            for (var i = 0; i < Table_Length; i++) {
                var Plant = Table_Id.getRows()[i].getCells()[0].getValue();
                var Plant01 = Plant.trim();
                if (Plant01 !== "") {
                    Plant_array.push(Plant01);
                } 

                var Material_Description = Table_Id.getRows()[i].getCells()[1].getValue();
                var Material_Description01 = Material_Description.trim();
                if (Material_Description01 !== "") {
                    Material_Desc_array.push(Material_Description01);
                    Table_Id.getRows()[i].getCells()[1].setValueState(sap.ui.core.ValueState.None);
                    Header_Status = "200";

                } else {
                    Table_Id.getRows()[i].getCells()[1].setValueState(sap.ui.core.ValueState.Error);
                    Table_Id.getRows()[i].getCells()[1].setValueStateText("Please Enter Material Description");
                    // MessageToast.show("Please Fill Material Description");
                    Header_Status = "";
                    break;
                }

                var Quantity = Table_Id.getRows()[i].getCells()[2].getValue();
                var Quantity01 = Quantity.trim();
                if (Quantity01 !== "") {
                    Quantity_array.push(Quantity01);
                    Table_Id.getRows()[i].getCells()[2].setValueState(sap.ui.core.ValueState.None);

                } else {
                    Table_Id.getRows()[i].getCells()[2].setValueState(sap.ui.core.ValueState.Error);
                    Table_Id.getRows()[i].getCells()[2].setValueStateText("Please Enter Quantity");
                    // MessageToast.show("Please Fill Quantity");
                    break;
                }

                var UOM = Table_Id.getRows()[i].getCells()[3].getValue();
                var UOM01 = UOM.trim();
                if (UOM01 !== "") {
                    UOM_array.push(UOM01);
                    Table_Id.getRows()[i].getCells()[3].setValueState(sap.ui.core.ValueState.None);

                } else {
                    Table_Id.getRows()[i].getCells()[3].setValueState(sap.ui.core.ValueState.Error);
                    Table_Id.getRows()[i].getCells()[3].setValueStateText("Please Enter UOM");
                    // MessageToast.show("Please Fill Quantity");
                    break;
                }


                var Amount = Table_Id.getRows()[i].getCells()[4].getValue();
                var Amount01 = Amount.trim();
                if (Amount01 !== "") {
                    Amount_array.push(Amount01);
                    Table_Id.getRows()[i].getCells()[4].setValueState(sap.ui.core.ValueState.None);

                } else {
                    Table_Id.getRows()[i].getCells()[4].setValueState(sap.ui.core.ValueState.Error);
                    Table_Id.getRows()[i].getCells()[4].setValueStateText("Please Enter Amount");
                    // MessageToast.show("Please Fill Amount");
                    break;
                }

                var Bill_No = Table_Id.getRows()[i].getCells()[5].getValue();
                var Vendor_Name = Table_Id.getRows()[i].getCells()[6].getValue();
                var No_Of_Packages = Table_Id.getRows()[i].getCells()[7].getValue();
                var Vehicle_No = Table_Id.getRows()[i].getCells()[8].getValue();
                var Person_Name = Table_Id.getRows()[i].getCells()[9].getValue();

                    itemData.push({
                        Id: Id,
                        Plant: Plant,
                        Material_Code: "",
                        Material_Description: Material_Description,
                        Quantity: Quantity,
                        UOM: UOM,
                        Amount: Amount,
                        Bill_No: Bill_No,
                        Vendor_Code: "",
                        Vendor_Name: Vendor_Name,
                        No_Of_Packages: No_Of_Packages,
                        Vehicle_No: Vehicle_No,
                        Person_Name: Person_Name,
                        Status:"",
                        Status01:"",
                        Field1: "",
                        Field2: "",
                        Field3: "",
                        Field4: ""

                    });
                }


                if (Plant_array.length === Material_Desc_array.length && Plant_array.length === Quantity_array.length && Plant_array.length === Amount_array.length && Plant_array.length === UOM_array.length){

                    var oEntry = {};  

                     oEntry.Id = Id;
                     oEntry.Plant = Plant_H;
                     oEntry.Vendor = Vendor_H;
                     oEntry.Partner_Doc_No = PartnerDocNo_H;
                     oEntry.No_Of_Packages = NoOfPackage_H;
                     oEntry.Vehicle_No = VehicleNo_H;
                     oEntry.Person_Name = PersonName_H;
                     oEntry.Status = "";
                     oEntry.Status01 = "";
                     oEntry.Field1 = "";
                     oEntry.Field2 = "";
                     oEntry.Field3 = "";
                     oEntry.Field4 = "";
                     oEntry.Field5 = "";

                     oEntry.to_Item = itemData;
                     this.getView().setModel();
                     var oModel = this.getOwnerComponent().getModel("YY1_CASH_PURCHASE_CDS");

                     var that = this;

                     oModel.create("/YY1_CASH_PURCHASE", oEntry, {
                         success: function (oData, oResponse) {

                             that._pBusyDialog.close();
                             MessageBox.success("Document No " + Id + " Generated", {
                                title: "Cash Purchase",
                                id: "messageBoxId1",
                                contentWidth: "100px",
                            });

                            that.getView().byId("Id").setValue("");
                            that.getView().byId("Plant_H").setValue("");
                            that.getView().byId("Vendor_H").setValue("");
                            that.getView().byId("PartnerDocNo_H").setValue("");
                            that.getView().byId("NoOfPackage_H").setValue("");
                            that.getView().byId("VehicleNo_H").setValue("");
                            that.getView().byId("PersonName_H").setValue("");

                            that.getOwnerComponent().getModel("YY1_CASH_PURCHASE_CDS").read("/YY1_CASH_PURCHASE/$count", { /* Decalure Globally in the Create table Serial Number */
                            success: $.proxy(function (oEvent, oResponse) {
                                let Count = Number(oResponse.body) + 1; // This should be a number, no need to use Number()
                                let CountLen = Count.toString(); // Convert to string to get its length
                                let AddData = "10001";
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

                            that.getView().byId("cashTable").setVisible(false);
                            that.getView().byId("Final_Save_Button").setEnabled(false);

                         }
                     });

                }
                else{
                    MessageBox.show("Please Fill the Mandatory Fields ", MessageBox.Icon.ERROR, "");
                    this._pBusyDialog.close();
                }
            
                                        
                },      

        });
    });
