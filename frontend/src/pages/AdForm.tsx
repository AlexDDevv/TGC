import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CategoryType, TagType, AdType } from "../../types";
import { useNavigate } from "react-router-dom";
import CategoryModal from "../components/CategoryModal";
import { useMutation, useQuery } from "@apollo/client";
import { queryCategories } from "../api/categories";
import { queryTags } from "../api/tags";
import { createAd } from "../api/createAd";
import { queryAds } from "../api/ads";
import { queryAd } from "../api/ad";
import { updateAd } from "../api/updateAd";
import styled from "styled-components";
import { Button } from "../components/StyledButton";

const TtitleForm = styled.h1`
    margin-bottom: 50px;
`;

const Form = styled.form`
    max-width: 400px;
`;

const InputsContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 20px;
    width: 100%;
    margin-bottom: 30px;
`;

const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 5px;
`;

const Label = styled.label`
    font-size: 14px;
`;

const Input = styled.input`
    background-color: white;
    border: 2px solid #ffa41b;
    border-radius: 8px;
    padding: 10px;
    font-size: 12px;

    &::placeholder {
        opacity: 0.8;
        font-style: italic;
    }
`;

const TextArea = styled(Input).attrs({ as: "textarea" })`
    font-family: Arial, sans-serif;
    height: 100px;
    resize: none;

    &::placeholder {
        opacity: 0.8;
        font-style: italic;
    }
`;

const CategoryContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;

    select {
        width: 60%;
    }
    button {
        width: 40%;
    }
`;

const Select = styled(Input).attrs({ as: "select" })`
    width: 60%;
    cursor: pointer;
`;

export default function AdFormPage() {
    const navigate = useNavigate();
    const params = useParams<{ id: string }>();
    const id = params.id && Number(params.id);

    const { data: adData } = useQuery<{ ad: AdType }>(queryAd, {
        variables: { adId: id },
        skip: !id,
    });
    const ad = adData?.ad;
    console.log(ad);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [location, setLocation] = useState("");
    const [picture, setPicture] = useState("");
    const [owner, setOwner] = useState("");
    const [categoryId, setCategoryId] = useState<number>();
    const [tagsIds, setTagsIds] = useState<number[]>([]);
    const [showCategoryForm, setShowCategoryForm] = useState(false);

    useEffect(() => {
        if (ad) {
            setTitle(ad.title);
            setDescription(ad.description);
            setPrice(ad.price);
            setLocation(ad.location);
            setPicture(ad.picture);
            setOwner(ad.owner);
            setCategoryId(ad.category?.id);

            const tagsIds: number[] = [];
            for (const tag of ad.tags) {
                tagsIds.push(tag.id);
            }
            setTagsIds(tagsIds);
        }
    }, [ad]);

    const handleCategoryForm = () => {
        setShowCategoryForm(!showCategoryForm);
    };

    const {
        data: categoriesData,
        loading: categoriesLoading,
        error: categoriesError,
    } = useQuery<{ categories: CategoryType[] }>(queryCategories);
    const categories = categoriesData?.categories;

    useEffect(() => {
        if (categories && categories.length && !categoryId) {
            setCategoryId(categories[0].id);
        }
    }, [categories]);

    const {
        data: tagsData,
        loading: tagsLoading,
        error: tagsError,
    } = useQuery<{ tags: TagType[] }>(queryTags);
    const tags = tagsData?.tags;

    const [doCreateAd, { loading: createLoading }] = useMutation<{
        createAd: AdType;
    }>(createAd, {
        refetchQueries: [queryAds],
    });

    const [doUpdateAd, { loading: updateLoading }] = useMutation<{
        updateAd: AdType;
    }>(updateAd, {
        refetchQueries: [queryAds, queryAd],
    });

    const loading = createLoading || updateLoading;

    const doSubmit = async () => {
        try {
            if (ad) {
                const { data } = await doUpdateAd({
                    variables: {
                        id: ad.id,
                        data: {
                            title,
                            description,
                            price,
                            location,
                            picture,
                            owner,
                            category: categoryId ? { id: categoryId } : null,
                            tags: tagsIds.map((id) => ({ id })),
                        },
                    },
                });
                navigate(`/ads/${data?.updateAd.id}`, { replace: true });
            } else {
                const { data } = await doCreateAd({
                    variables: {
                        data: {
                            title,
                            description,
                            price,
                            location,
                            picture,
                            owner,
                            category: categoryId ? { id: categoryId } : null,
                            tags: tagsIds.map((id) => ({ id })),
                        },
                    },
                });
                navigate(`/ads/${data?.createAd.id}`, { replace: true });
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (categoriesLoading) return <p>Loading...</p>;
    if (categoriesError) return <p>Error : {categoriesError.message}</p>;

    if (tagsLoading) return <p>Loading...</p>;
    if (tagsError) return <p>Error : {tagsError.message}</p>;

    return (
        <>
            <TtitleForm>
                {ad ? "Modifier une annonce" : "Poster une annonce"}
            </TtitleForm>
            <Form
                onSubmit={(e) => {
                    e.preventDefault();
                    doSubmit();
                }}
            >
                <InputsContainer>
                    <InputContainer>
                        <Label htmlFor="title">Titre de l'annonce</Label>
                        <Input
                            id="title"
                            type="text"
                            placeholder="Ajouter un titre..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </InputContainer>
                    <InputContainer>
                        <Label htmlFor="description">
                            Description de l'annonce
                        </Label>
                        <TextArea
                            id="description"
                            placeholder="Ajouter une description..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></TextArea>
                    </InputContainer>
                    <InputContainer>
                        <Label htmlFor="price">Prix de l'annonce</Label>
                        <Input
                            id="price"
                            type="number"
                            placeholder="Ajouter un prix..."
                            value={price}
                            onChange={(e) => setPrice(Number(e.target.value))}
                        />
                    </InputContainer>
                    <InputContainer>
                        <Label htmlFor="picture">URL de l'image</Label>
                        <Input
                            id="picture"
                            type="text"
                            placeholder="Ajouter l'URL d'une image..."
                            value={picture}
                            onChange={(e) => setPicture(e.target.value)}
                        />
                    </InputContainer>
                    <InputContainer>
                        <Label htmlFor="owner">Propriétaire de l'annonce</Label>
                        <Input
                            id="owner"
                            type="text"
                            placeholder="Ajouter une adresse mail..."
                            value={owner}
                            onChange={(e) => setOwner(e.target.value)}
                        />
                    </InputContainer>
                    <InputContainer>
                        <Label htmlFor="location">
                            Localisation de l'annonce
                        </Label>
                        <Input
                            id="location"
                            type="text"
                            placeholder="Ajouter une localisation..."
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </InputContainer>
                    <InputContainer>
                        <Label htmlFor="categories">
                            Sélectionnez une catégorie
                        </Label>
                        <CategoryContainer>
                            <Select
                                id="categories"
                                value={categoryId}
                                onChange={(e) =>
                                    setCategoryId(Number(e.target.value))
                                }
                            >
                                {categories?.map((category: CategoryType) => (
                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.name}
                                    </option>
                                ))}
                            </Select>
                            <Button type="button" onClick={handleCategoryForm}>
                                {showCategoryForm
                                    ? "Fermer le formulaire"
                                    : "Ajouter une catégorie"}
                            </Button>
                        </CategoryContainer>

                        {showCategoryForm && (
                            <CategoryModal
                                onCategoryCreated={async (id) => {
                                    setShowCategoryForm(false);
                                    setCategoryId(id);
                                }}
                            />
                        )}
                    </InputContainer>
                    <InputContainer>
                        <Label htmlFor="tags">Sélectionnez un tag</Label>
                        <Select id="tags">
                            {tags?.map((tag) => (
                                <option key={tag.id} value={tag.name}>
                                    {tag.name}
                                </option>
                            ))}
                        </Select>
                    </InputContainer>
                </InputsContainer>
                <Button>
                    {ad ? "Modifier mon annonce" : "Créer mon annonce"}
                </Button>
                {loading === true && <p>Envoi...</p>}
            </Form>
        </>
    );
}