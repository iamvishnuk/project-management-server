const Category = require("../Model/category-model")

const createCategory = async (req, res) => {
    try {

        const { categoryName, categoryDescription } = req.body
        const found = await Category.findOne({ categoryName: categoryName })
        if (found) {
            res.status(422).json({ message: "category name already exist" })
        } else {
            const category = new Category({
                categoryName: categoryName,
                categoryDescription: categoryDescription,
                createBy: req.userId
            })
            await category.save()
            res.status(201).json({ message: "New category created" })
        }

    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

const getCategoryData = async (req, res) => {
    try {

        const categoryData = await Category.find({ createBy: req.userId })
        res.status(200).json({ data: categoryData })

    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

const deleteCategory = async (req, res) => {
    try {
        const { deleteCategoryId } = req.params
        const response = await Category.deleteOne({ _id: deleteCategoryId })
        if (response) {
            res.status(200).json({ delete: true, message: "successfully delete the category" })
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

const editCategory = async (req, res) => {
    try {
        const { _id, categoryName, categoryDescription } = req.body
        if (categoryName == "") {
            res.status(404).json({ update: false, message: "Category name is must" })
        } else if (categoryDescription == "") {
            res.status(404).json({ update: false, message: "Category description is must" })
        } else {
            await Category.updateOne({ _id: _id }, {
                $set:
                {
                    categoryName: categoryName,
                    categoryDescription: categoryDescription
                }
            }).then(() => res.status(200).json({ update: true, message: "successfully update the category" }))
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

module.exports = { 
    createCategory, 
    getCategoryData, 
    deleteCategory, 
    editCategory 
} 