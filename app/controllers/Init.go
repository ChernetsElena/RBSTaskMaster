package controllers

import "github.com/revel/revel"

func init() {
	revel.InterceptMethod((*CEmployee).Init, revel.BEFORE)
	revel.InterceptMethod((*CProject).Init, revel.BEFORE)
	revel.InterceptMethod((*CPosition).Init, revel.BEFORE)
	revel.InterceptMethod((*CTask).Init, revel.BEFORE)
	revel.InterceptMethod((*CStatus).Init, revel.BEFORE)
	revel.InterceptMethod((*CUrgently).Init, revel.BEFORE)
}
