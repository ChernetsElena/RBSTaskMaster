// GENERATED CODE - DO NOT EDIT
// This file provides a way of creating URL's based on all the actions
// found in all the controllers.
package routes

import "github.com/revel/revel"


type tStatic struct {}
var Static tStatic


func (_ tStatic) Serve(
		prefix string,
		filepath string,
		) string {
	args := make(map[string]string)
	
	revel.Unbind(args, "prefix", prefix)
	revel.Unbind(args, "filepath", filepath)
	return revel.MainRouter.Reverse("Static.Serve", args).URL
}

func (_ tStatic) ServeDir(
		prefix string,
		filepath string,
		) string {
	args := make(map[string]string)
	
	revel.Unbind(args, "prefix", prefix)
	revel.Unbind(args, "filepath", filepath)
	return revel.MainRouter.Reverse("Static.ServeDir", args).URL
}

func (_ tStatic) ServeModule(
		moduleName string,
		prefix string,
		filepath string,
		) string {
	args := make(map[string]string)
	
	revel.Unbind(args, "moduleName", moduleName)
	revel.Unbind(args, "prefix", prefix)
	revel.Unbind(args, "filepath", filepath)
	return revel.MainRouter.Reverse("Static.ServeModule", args).URL
}

func (_ tStatic) ServeModuleDir(
		moduleName string,
		prefix string,
		filepath string,
		) string {
	args := make(map[string]string)
	
	revel.Unbind(args, "moduleName", moduleName)
	revel.Unbind(args, "prefix", prefix)
	revel.Unbind(args, "filepath", filepath)
	return revel.MainRouter.Reverse("Static.ServeModuleDir", args).URL
}


type tTestRunner struct {}
var TestRunner tTestRunner


func (_ tTestRunner) Index(
		) string {
	args := make(map[string]string)
	
	return revel.MainRouter.Reverse("TestRunner.Index", args).URL
}

func (_ tTestRunner) Suite(
		suite string,
		) string {
	args := make(map[string]string)
	
	revel.Unbind(args, "suite", suite)
	return revel.MainRouter.Reverse("TestRunner.Suite", args).URL
}

func (_ tTestRunner) Run(
		suite string,
		test string,
		) string {
	args := make(map[string]string)
	
	revel.Unbind(args, "suite", suite)
	revel.Unbind(args, "test", test)
	return revel.MainRouter.Reverse("TestRunner.Run", args).URL
}

func (_ tTestRunner) List(
		) string {
	args := make(map[string]string)
	
	return revel.MainRouter.Reverse("TestRunner.List", args).URL
}


type tApp struct {}
var App tApp


func (_ tApp) Index(
		) string {
	args := make(map[string]string)
	
	return revel.MainRouter.Reverse("App.Index", args).URL
}


type tCAuth struct {}
var CAuth tCAuth


func (_ tCAuth) Init(
		) string {
	args := make(map[string]string)
	
	return revel.MainRouter.Reverse("CAuth.Init", args).URL
}

func (_ tCAuth) Login(
		) string {
	args := make(map[string]string)
	
	return revel.MainRouter.Reverse("CAuth.Login", args).URL
}

func (_ tCAuth) Logout(
		) string {
	args := make(map[string]string)
	
	return revel.MainRouter.Reverse("CAuth.Logout", args).URL
}

func (_ tCAuth) Check(
		) string {
	args := make(map[string]string)
	
	return revel.MainRouter.Reverse("CAuth.Check", args).URL
}

func (_ tCAuth) GetCurrentEmployee(
		) string {
	args := make(map[string]string)
	
	return revel.MainRouter.Reverse("CAuth.GetCurrentEmployee", args).URL
}


type tCEmployee struct {}
var CEmployee tCEmployee


func (_ tCEmployee) Init(
		) string {
	args := make(map[string]string)
	
	return revel.MainRouter.Reverse("CEmployee.Init", args).URL
}

func (_ tCEmployee) GetAll(
		) string {
	args := make(map[string]string)
	
	return revel.MainRouter.Reverse("CEmployee.GetAll", args).URL
}

func (_ tCEmployee) GetByID(
		id int64,
		) string {
	args := make(map[string]string)
	
	revel.Unbind(args, "id", id)
	return revel.MainRouter.Reverse("CEmployee.GetByID", args).URL
}

func (_ tCEmployee) Create(
		) string {
	args := make(map[string]string)
	
	return revel.MainRouter.Reverse("CEmployee.Create", args).URL
}

func (_ tCEmployee) Update(
		) string {
	args := make(map[string]string)
	
	return revel.MainRouter.Reverse("CEmployee.Update", args).URL
}

func (_ tCEmployee) Delete(
		) string {
	args := make(map[string]string)
	
	return revel.MainRouter.Reverse("CEmployee.Delete", args).URL
}


type tCError struct {}
var CError tCError


func (_ tCError) Unauthorized(
		) string {
	args := make(map[string]string)
	
	return revel.MainRouter.Reverse("CError.Unauthorized", args).URL
}


type tCIndex struct {}
var CIndex tCIndex


func (_ tCIndex) Init(
		) string {
	args := make(map[string]string)
	
	return revel.MainRouter.Reverse("CIndex.Init", args).URL
}

func (_ tCIndex) Index(
		) string {
	args := make(map[string]string)
	
	return revel.MainRouter.Reverse("CIndex.Index", args).URL
}


type tCPosition struct {}
var CPosition tCPosition


func (_ tCPosition) Init(
		) string {
	args := make(map[string]string)
	
	return revel.MainRouter.Reverse("CPosition.Init", args).URL
}

func (_ tCPosition) GetAll(
		) string {
	args := make(map[string]string)
	
	return revel.MainRouter.Reverse("CPosition.GetAll", args).URL
}


type tCProject struct {}
var CProject tCProject


func (_ tCProject) Init(
		) string {
	args := make(map[string]string)
	
	return revel.MainRouter.Reverse("CProject.Init", args).URL
}

func (_ tCProject) GetAll(
		) string {
	args := make(map[string]string)
	
	return revel.MainRouter.Reverse("CProject.GetAll", args).URL
}

func (_ tCProject) GetByID(
		id int64,
		) string {
	args := make(map[string]string)
	
	revel.Unbind(args, "id", id)
	return revel.MainRouter.Reverse("CProject.GetByID", args).URL
}

func (_ tCProject) Create(
		) string {
	args := make(map[string]string)
	
	return revel.MainRouter.Reverse("CProject.Create", args).URL
}

func (_ tCProject) Update(
		) string {
	args := make(map[string]string)
	
	return revel.MainRouter.Reverse("CProject.Update", args).URL
}

func (_ tCProject) Delete(
		) string {
	args := make(map[string]string)
	
	return revel.MainRouter.Reverse("CProject.Delete", args).URL
}


type tCStatus struct {}
var CStatus tCStatus


func (_ tCStatus) Init(
		) string {
	args := make(map[string]string)
	
	return revel.MainRouter.Reverse("CStatus.Init", args).URL
}

func (_ tCStatus) GetAll(
		) string {
	args := make(map[string]string)
	
	return revel.MainRouter.Reverse("CStatus.GetAll", args).URL
}


type tCTask struct {}
var CTask tCTask


func (_ tCTask) Init(
		) string {
	args := make(map[string]string)
	
	return revel.MainRouter.Reverse("CTask.Init", args).URL
}

func (_ tCTask) GetAllByProject(
		id int64,
		) string {
	args := make(map[string]string)
	
	revel.Unbind(args, "id", id)
	return revel.MainRouter.Reverse("CTask.GetAllByProject", args).URL
}

func (_ tCTask) GetByID(
		id int64,
		) string {
	args := make(map[string]string)
	
	revel.Unbind(args, "id", id)
	return revel.MainRouter.Reverse("CTask.GetByID", args).URL
}

func (_ tCTask) Create(
		) string {
	args := make(map[string]string)
	
	return revel.MainRouter.Reverse("CTask.Create", args).URL
}

func (_ tCTask) Update(
		) string {
	args := make(map[string]string)
	
	return revel.MainRouter.Reverse("CTask.Update", args).URL
}

func (_ tCTask) Delete(
		) string {
	args := make(map[string]string)
	
	return revel.MainRouter.Reverse("CTask.Delete", args).URL
}


type tCUrgently struct {}
var CUrgently tCUrgently


func (_ tCUrgently) Init(
		) string {
	args := make(map[string]string)
	
	return revel.MainRouter.Reverse("CUrgently.Init", args).URL
}

func (_ tCUrgently) GetAll(
		) string {
	args := make(map[string]string)
	
	return revel.MainRouter.Reverse("CUrgently.GetAll", args).URL
}


