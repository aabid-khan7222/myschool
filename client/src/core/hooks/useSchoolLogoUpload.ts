import { useCallback, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { apiService } from "../services/apiService";
import { patchAuthUser, selectUser } from "../data/redux/authSlice";

/**
 * Headmaster (Admin) can upload a new school logo from anywhere this hook is used.
 * Syncs tenant profile + master_db.schools.logo on the server; refreshes Redux school_logo.
 */
export function useSchoolLogoUpload() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isHeadmaster = (user?.role ?? "").toString().trim().toLowerCase() === "admin";
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const openFilePicker = useCallback(() => {
    if (!isHeadmaster || uploading) return;
    inputRef.current?.click();
  }, [isHeadmaster, uploading]);

  const onFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isHeadmaster) return;
      const file = e.target.files?.[0];
      if (!file) return;
      setUploading(true);
      try {
        await apiService.uploadSchoolLogo(file);
        const me = await apiService.getMe();
        if (me?.status === "SUCCESS" && me.data && me.data.school_logo !== undefined) {
          dispatch(patchAuthUser({ school_logo: me.data.school_logo ?? null }));
        }
      } catch (err) {
        const msg = (err as Error)?.message || "Failed to upload school logo";
        window.alert(msg);
      } finally {
        setUploading(false);
        e.target.value = "";
      }
    },
    [dispatch, isHeadmaster]
  );

  return {
    isHeadmaster,
    uploading,
    inputRef,
    openFilePicker,
    onFileChange,
  };
}
