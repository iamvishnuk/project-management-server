const Category = require("../Model/category-model")

const createCategory = async (req, res) => {
    try {

        const { categoryName, categoryDescription } = req.body
        const found = await Category.findOne({ categoryName: categoryName })
        console.log(found)
        if (found) {
            res.status(422).json({ message: "category name already exist" })
        } else {
            const category = new Category({
                categoryName: categoryName,
                categoryDescription: categoryDescription
            })
            await category.save()
            res.status(201).json({ message: "New category created" })
        }

    } catch (error) {
        console.log(error)
    }
}

const getCategoryData = async (req, res) => {
    try {

        const categoryData = await Category.find({})
        res.status(200).json({ data: categoryData })

    } catch (error) {
        console.log(error)
    }
}

const deleteCategory = async (req, res) => {
    try {
        const { deleteCategoryId } = req.params
        console.log(deleteCategoryId)
        const response = await Category.deleteOne({ _id: deleteCategoryId })
        if(response) {
            res.status(200).json({ delete: true, message: "successfully delete the category" })
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports = { createCategory, getCategoryData, deleteCategory } 