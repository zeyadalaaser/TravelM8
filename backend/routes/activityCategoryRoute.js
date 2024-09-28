import expresss from 'express';
import {createActivityCategory, getAllActivityCategories, updateActivityCategory, deleteActivityCategory} from '../controllers/activityCategoryController.js';

const router =expresss.Router();

// Activity Category CRUD Routes
router.post(
    "/api/activity-category",
    createActivityCategory
  );
  router.get(
    "/api/activity-categories",
    getAllActivityCategories
  );
  router.put(
    "/api/activity-category/:id",
    updateActivityCategory
  );
  router.delete(
    "/api/activity-category/:id",
    deleteActivityCategory
  );
  
  export default router;
