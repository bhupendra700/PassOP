import express from "express"
import { acceptRequest, deleteRecievedDocs, deleteSendedDocs, deleteUserfromrequestrecieved, deleteUserfromrequestsent, recievedRequestCancel, registerToken, searchUser, sendDocs, sendNotification, sendRequest, sendRequestCancel, setDisappear } from "../controller/shareController.js";
const shareRouter = express.Router();
import tokenValidation from "../middleware/tokenValidation.js"

shareRouter.post('/searchuser', searchUser);

shareRouter.post('/disappear', tokenValidation, setDisappear);

shareRouter.post('/sendrequest', tokenValidation, sendRequest);

shareRouter.post('/sendRequestCancel', tokenValidation, sendRequestCancel);

shareRouter.post('/acceptrequest', tokenValidation, acceptRequest);

shareRouter.post('/recievedrequestcancel', tokenValidation, recievedRequestCancel);

shareRouter.post('/deleteUserfromrequestrecieved', tokenValidation, deleteUserfromrequestrecieved);

shareRouter.post('/deleteUserfromrequestsent', tokenValidation, deleteUserfromrequestsent);

shareRouter.post('/senddocs', tokenValidation, sendDocs);

shareRouter.post('/deleteSendedDocs', tokenValidation, deleteSendedDocs);

shareRouter.post('/deleteRecievedDocs', tokenValidation, deleteRecievedDocs);

shareRouter.post('/registerToken', tokenValidation, registerToken);

shareRouter.post('/sendNotification', tokenValidation, sendNotification);

export default shareRouter;