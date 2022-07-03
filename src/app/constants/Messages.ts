export class Messages {
    static readonly FETCH_SUCCESSFUL: string = "Fetch Successful";
    static readonly CREATE_SUCCESSFUL: string = "Create Successful";
    static readonly SIMULATE_SUCCESSFUL: string = "Simulate Successful";
    static readonly UPDATE_SUCCESSFUL: string = "Update Successful";
    static readonly DELETE_SUCCESSFUL: string = "Delete Successful";
    static readonly FETCH_FAILED: string = "Fetch Failed";
    static readonly CREATE_FAILED: string = "Create Failed";
    static readonly UPDATE_FAILED: string = "Update Failed";
    static readonly DELETE_FAILED: string = "Delete Failed";

    static readonly VALIDATION_ERROR: string = "Validation Error";
    static readonly SUCCESSFULLY_RECORD_ADDED: string = "successfully recorded added";
    static readonly SUCCESSFULLY_UPLOADED_FILE: string = "successfully file uploaded";
    static readonly SUCCESSFULLY_FILE_IMPORTED: string = "successfully file Imported";
    static readonly UPLOAD_FILE_TYPE_ERROR: string = "Upload file type error";
    static readonly SUCCESSFULLY_LOGIN: string = "Successfully login";
    static readonly UNSUCCESSFULLY_LOGIN: string = "Unsuccessfully login";
    static readonly UNAUTHORIZED_ACCESS: string = "Unauthorized Access";
    static readonly SUCCESSFULLY_LOGOUT: string = "Successfully logout";

    static readonly SUCCESS: string = "Success";
    static readonly FAILED: string = "Failed";

    static readonly PASSWORD_RESET_SUCCESS_PLEASE_LOGIN_WITH_YOUR_NEW_PASSWORD: string = "Password Reset Successfully, Please login with your new password.";
    static readonly PASSWORD_CHANGED_SUCCESSFULLY: string = "Password changed successfully";
    static readonly OTP_IS_ALREADY_SENT: string = "OTP is already sent, you can request new OTP after 10 minutes.";
    static readonly INVALID_OTP: string = "Invalid OTP or, Please request for new OTP";
    static readonly OTP_SENT_SUCCESSFULLY: string = "OTP is send to your Email, please check";
    static readonly OTP_SENT_SUCCESSFULLY_TO_YOUR_MOBILE: string = "OTP is send to your mobile, please check";

    static readonly INVALID_EMAIL_PASSWORD: string = "Invalid Email or Password.";
    static readonly INVALID_EMAIL_OLD_PASSWORD: string = "Invalid Email or Old Password.";
    static readonly OLD_PASSWORD_AND_NEW_PASSWORD_ARE_SAME: string = "OldPassword and NewPassword are same.";

    static readonly SOMETHING_WENT_WRONG: string = "Something went wrong plz Contact Admin...";
    static readonly TRY_AGAIN_AFTER_SOMETIME: string = "Try again after some time...";
    static readonly NO_SKU_DATA: string = "No Sku Data Found";

    static readonly DEVICE_ALREADY_REGISTERED: string = "Device already registered";
    static readonly DEVICE_REGISTERED_SUCCESSFULLY: string = "Device registered successfully";

    static readonly SUCCESSFULLY_REGISTERED: string = "Successfully registered";

    static readonly DEVICE_IS_NOT_LOGGED_IN: string = "Device is not loggedIn";
    static readonly DEVICE_TRIGGERED_SUCCESSFULLY: string = "Device triggered successfully";
    static readonly USER_DISCONNECTED: string = "User disconnected";

    static readonly COLLATERAL_DATA: string = "Collateral data";
    static readonly DEVICE_ACCESS_ALREADY_THERE: string = "Device access already there";
    static readonly DEVICE_ACCESS_NOT_THERE: string = "Device access is not there for this device";

    static readonly NO_SUMMARY_DATA: string = "Invalid Id, Couldn't get Summary Report";

    static readonly DEVICE_NOT_YET_REGISTERED: string = "Device not yet registered";
    static readonly DEVICE_IS_NOT_ONLINE: string = "Device is not online";

    static readonly DIAMOND_MATCH_CREATED_SUCCESSFUL: string = "diamond match created successful"
    static readonly STATUS_UPDATE_SUCCESSFUL: string = "status updated successful"
    static readonly LED_TRIGGERED_SUCCESSFULLY: string = "Led triggered successfully"

    static readonly OPENED_BUSINESS_SUCCESSFULLY: string = "opened Business successfully"
    static readonly CLOSED_BUSINESS_SUCCESSFULLY: string = "closed Business successfully"
    static readonly CLOSED_BUSINESS_FAILED_WITH_STONES_MISSING: string = "Close of business failure. Stones not in RFID device"
    static readonly CLOSED_BUSINESS_FAILED_DIAMOND_MATCH: string = "Close of business failure. Please complete daily DiamondMatch before closing business"

    static readonly CARAT_RANGE_EXISTS: string = "carat range already exists in system"
    static readonly CLARITY_EXISTS: string = "clarity already exists in system"
    static readonly CLARITY_RANGE_EXISTS: string = "clarity range already exists in system"
    static readonly COLOR_EXISTS: string = "color already exists in system"
    static readonly COLOR_RANGE_EXISTS: string = "color range already exists in system"

    static readonly STONE_NOT_YET_REGISTERED: string = "stone is not yet registered"
    static readonly NOSTONES_IN_COLLATERAL: string = "There are no stones in collateral"

    static readonly USERID_OR_ROLEID_MISSING: string = "userId/roleId is missing"
    static readonly INVALID_FILE: string = "Invaild file"  //Todo fix all typo in whole project.
    static readonly DMGUID_IS_ALREADY_PRESENT: string = "dmGuid is already present"

    static readonly CLOSED_BUSINESS_FAILED: string = "Close of business failure. Cannot open or close business"
    static readonly OPEN_BUSINESS_FAILED: string = "Open of business failure. Cannot open or close business"
    static readonly OPEN_BUSINESS_FAILED_FOR_DAILY: string = "Open of business failure. Business is already opened"
    static readonly CLOSED_BUSINESS_FAILED_FOR_DAILY: string = "Close of business failure, Business is already closed"
    static readonly CLOSED_BUSINESS_FAILED_WITH_OPENED: string = "Close of business failure, Business is not opened"
    static readonly OPEN_BUSINESS_FAILED_FOR_DAILY_WITH_CLOSED: string = "Open of business failure. Business is already closed"
    static readonly ADD_TO_WISHLIST: string = "Added in wishlist"
    static readonly REMOVE_SUCCESSFULLY: string = "Remove successfully"
    static readonly DELETED_BY_USER_WISHLIST: string = "Delete by user"
    static readonly SUCCESSFULLY_ADDED_TO_CART: string = "Product successfully added to cart"

    static readonly ADD_TO_CART: string = "Added in cart"
    static readonly ORDER_PLACED_SUCCESSFULLY: string = "Order Placed Successfully"
    static readonly INVALID_ORDER: string = "Invalid Order Id Given"


}
