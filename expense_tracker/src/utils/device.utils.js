
async function insertOrUpdateDevice(db, userId, deviceInfo) 
{
    const { device_id, device_name, device_type, device_token, device_version } = deviceInfo;

    const existingDevices = await db.query(
        "SELECT * FROM device WHERE user_id = ?",
        [userId]
    );

    
	//user Id Absent in device table
    if (existingDevices.length === 0) 
    {
    	const newDeviceData = {
        	user_id: userId,
        	device_id,
        	device_name,
        	device_type,
        	device_token,
        	device_version
    	};
        await db.query("INSERT INTO device SET ?", [newDeviceData]);
    } //Present 
	else 
    {
        const currentDevice = existingDevices[0];
        const isChanged =
            currentDevice.device_id !== device_id ||
            currentDevice.device_name !== device_name ||
            currentDevice.device_type !== device_type ||
            currentDevice.device_token !== device_token ||
            currentDevice.device_version !== device_version;

        if (isChanged) 
        {
            const updateData = {
                device_id,
                device_name,
                device_type,
                device_token,
                device_version
            };
            await db.query("UPDATE device SET ? WHERE user_id = ?", [updateData, userId]);
        }
    }
}

module.exports = {insertOrUpdateDevice}