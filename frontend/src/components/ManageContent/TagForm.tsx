import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { TagType } from "../../../types";
import { queryTag } from "../../api/tag";
import { updateTag } from "../../api/updateTag";
import { queryTags } from "../../api/tags";
import { createTag } from "../../api/createTag";
import { useToast } from "../UI/Toaster/ToasterHook";
import clsx from "clsx";
import ActionButton from "../UI/ActionButton";

export default function TagForm(props: {
    onTagCreated: (newId: number) => void;
    onTagUpdated: (updatedId: number) => void;
    editingTagId?: number;
}) {
    const [name, setName] = useState<string>("");
    const [error, setError] = useState<boolean>(false);
    const editingTagId = props.editingTagId;
    const { addToast } = useToast();

    const { data: tagData } = useQuery<{ tag: TagType }>(queryTag, {
        variables: { tagId: editingTagId ?? null },
        skip: !editingTagId,
    });
    const tag = tagData?.tag;

    const [doUpdateTag] = useMutation<{
        updateTag: { id: number; name: string };
    }>(updateTag, { refetchQueries: [queryTags] });

    const [doCreateTag] = useMutation<{
        createTag: { id: number; name: string };
    }>(createTag, { refetchQueries: [queryTags] });

    const { data: tagsData } = useQuery<{ tags: TagType[] }>(queryTags);
    const tags = tagsData?.tags;
    console.log("🚀 ~ tags:", tags);

    useEffect(() => {
        if (editingTagId !== undefined && tag) {
            setName(tag.name);
        } else {
            setName("");
        }
    }, [tag, editingTagId]);

    const checkExistingTag = (name: string) => {
        return tags?.find(
            (tag: TagType) => tag.name.toLowerCase() === name.toLowerCase(),
        );
    };

    const doSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const trimmedName = name.trim();

        if (trimmedName === "") {
            setError(true);
            addToast("Le champ ne peut pas être vide", "error");
            return;
        }

        if (trimmedName.length < 2) {
            setError(true);
            addToast(
                "Le nom du tag doit contenir au moins 2 caractères",
                "error",
            );
            return;
        }

        try {
            if (editingTagId !== undefined) {
                const existingTag = checkExistingTag(trimmedName);

                if (existingTag) {
                    setError(true);
                    addToast("Veuillez saisir un nom différent", "error");
                    return;
                }

                const tag = await doUpdateTag({
                    variables: {
                        id: editingTagId,
                        data: { name },
                    },
                });

                setName("");
                setError(false);
                addToast("Tag modifié avec succès !", "success");

                const updatedTagId = tag.data?.updateTag.id;

                if (updatedTagId !== undefined) {
                    props.onTagUpdated(updatedTagId);
                }
            } else {
                const existingTag = checkExistingTag(trimmedName);

                if (existingTag) {
                    setError(true);
                    addToast("Le tag existe déjà", "error");
                    return;
                }

                const tag = await doCreateTag({
                    variables: {
                        data: { name },
                    },
                });

                setName("");
                setError(false);
                addToast("Tag créé avec succès !", "success");

                const newTagId = tag.data?.createTag.id;

                if (newTagId) {
                    props.onTagCreated(newTagId);
                }
            }
        } catch (error) {
            setError(true);
            console.error("Une erreur est survenue :", error);
            addToast("Une erreur est survenue.", "error");
        }
    };

    return (
        <form
            onSubmit={doSubmit}
            className="bg-card border-border flex w-80 flex-col gap-5 rounded-lg border p-5"
        >
            <h6 className="text-card-foreground font-title text-lg font-bold">
                {editingTagId !== undefined
                    ? "Modifier un tag"
                    : "Créer un nouveau tag"}
            </h6>
            <div className="flex flex-col gap-1">
                <label className="text-card-foreground text-sm">
                    Nom du tag
                </label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                        setError(false);
                    }}
                    placeholder="Entrer un nom pour le tag"
                    className={clsx(
                        "bg-input text-accent-foreground focus:outline-ring rounded-lg p-3 text-xs placeholder:italic placeholder:opacity-85 focus:outline-2",
                        error &&
                            "border-destructive outline-destructive border",
                    )}
                />
            </div>
            <ActionButton
                type="submit"
                bgColor="bg-primary"
                color="text-primary-foreground"
                content={
                    editingTagId !== undefined
                        ? "Modifier le tag"
                        : "Créer le tag"
                }
            />
        </form>
    );
}
