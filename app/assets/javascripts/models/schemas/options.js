import React from 'react';
import t from 'tcomb-form';

import classNames from 'classnames';

import VirtualKeyboardFactory from 'views/components/Editor/fields/virtualKeyboard';

import WysiwygFactory from 'views/components/Editor/fields/wysiwyg';
import SelectSuggestFactory from 'views/components/Editor/fields/selectSuggest';
import SelectFactory from 'views/components/Editor/fields/select';
import MediaFactory from 'views/components/Editor/fields/media';

import {FlatButton, IconButton} from 'material-ui';
import IntlService from "views/services/intl";

const intl = IntlService.instance;

const i18nExt = {
    add: '+ ' + intl.trans('add_new', 'Add New', 'first'),
    down: '▼',
    remove: 'X',
    up: '▲',
    optional: '(' + intl.trans('optional', 'Optional', 'first') + ')'
}

window.intl = IntlService.instance;

const configExt = {
    config: {
        // for each of lg md sm xs you can specify the columns width
        horizontal: {
            md: [3, 9],
            sm: [6, 6]
        }
    }
}

const FVPortalTemplate = function template(locals) {
    return (
        <fieldset>
            <div className="col-md-12">
                {locals.inputs['fv-portal:greeting']}
            </div>
            <div className="col-md-12">
                {locals.inputs['fv-portal:about']}
            </div>
            <div className="col-md-12">
                {locals.inputs['fv-portal:news']}
            </div>
            <div className="col-md-12">
                {locals.inputs['fv-portal:featured_words']}
            </div>
            <div className="col-md-12">
                {locals.inputs['fv-portal:related_links']}
            </div>
            <div className="col-md-12">
                {locals.inputs['fv-portal:featured_audio']}
            </div>
            <div className="col-md-6">
                {locals.inputs['fv-portal:background_top_image']}
            </div>
            <div className="col-md-6">
                {locals.inputs['fv-portal:logo']}
            </div>
        </fieldset>
    )
}

const DefinitionsLayout = function (locals) {
    return (
        <div className="table-responsive">
            <table className="table">
                <tbody>
                <tr>
                    <td>{locals.inputs.language}</td>
                    <td>{locals.inputs.translation}</td>
                </tr>
                </tbody>
            </table>
        </div>
    );
};

const RelatedMediaLayout = function (locals) {
    return (
        <div className="row" style={{margin: '15px 0'}}>
            <fieldset>
                <legend>{locals.label} <FlatButton label={locals.add.label} onClick={locals.add.click}/></legend>
                {(locals.items || []).map(function (item, i) {
                    return <div key={i} className={classNames('col-xs-12', 'col-md-3')}>
                        {item.input}
                        <div style={{
                            textAlign: 'center',
                            marginTop: '-15px',
                            backgroundColor: 'rgba(234, 234, 234, 0.6)',
                            borderRadius: '0 0 10px 10px'
                        }}>
                            {item.buttons.map((button, i) => {

                                let icon = '';
                                let label = '';

                                switch (button.type) {
                                    case 'remove':
                                        icon = 'clear';
                                        label = intl.trans('remove_item', 'Remove Item', 'first');
                                        break;

                                    case 'move-up':
                                        icon = 'arrow_back';
                                        label = intl.trans('move_left', 'Move left (appears first)', 'first');
                                        break;

                                    case 'move-down':
                                        icon = 'arrow_forward';
                                        label = intl.trans('move_right', 'Move right', 'first');
                                        break;
                                }

                                return <IconButton tooltip={label}
                                                   iconClassName="material-icons" key={i}
                                                   onClick={button.click}
                                                   style={{verticalAlign: '-8px'}}>{icon}</IconButton>;
                            })}
                        </div>
                    </div>;
                })}
            </fieldset>
        </div>
    );
};

t.String.getValidationErrorMessage = (value, path, context) => {
    if (!value) {
        return intl.translate({
            key: 'models.value_in_field_x_cannot_be_empty',
            params: [context.options.label],
            default: 'Value in field ' + context.options.label + ' cannot be empty.',
            case: 'first'
        });
    }
};

const FVMedia = {
    order: ['dc:title', 'dc:description', 'file', 'fvm:shared', 'fvm:child_focused', 'fvm:source', 'fvm:recorder'],
    fields: {
        'dc:title': {
            label: intl.trans("name", 'Name', 'first'),
            type: 'text'
        },
        'dc:description': {
            label: intl.trans("description", 'Description', 'first'),
            type: 'textarea'
        },
        'file': {
            label: intl.trans("file", 'File', 'first'),
            type: 'file'
        },
        'fvm:shared': {
            label: intl.trans("models.shared_accross_dialects", 'Shared Accross Dialects?', 'first')
        },
        'fvm:child_focused': {
            label: intl.trans("models.child_focused", 'Child Focused', 'first')
        },
        'fvm:source': {
            label: intl.trans("source", 'Source', 'first'),
            item: {
                factory: SelectSuggestFactory,
                type: 'FVContributor'
            }
        },
        'fvm:recorder': {
            label: intl.trans("recorder", 'Recorder', 'first'),
            item: {
                factory: SelectSuggestFactory,
                type: 'FVContributor'
            }
        }
    },
    config: {
        horizontal: {
            md: [3, 9],
            sm: [6, 6]
        }
    },
    i18n: i18nExt
};

const options = {
    FVWord: {
        order: ['dc:title', 'fv-word:part_of_speech', 'fv-word:pronunciation', 'fv:definitions', 'fv:literal_translation', 'fv:related_audio', 'fv:related_pictures', 'fv:related_videos', 'fv-word:related_phrases', 'fv-word:categories', 'fv:cultural_note', 'fv:reference', 'fv:source', 'fv:available_in_childrens_archive', 'fv-word:available_in_games'],
        fields: {
            'dc:title': {
                label: intl.trans('word', 'Word', 'first'),
                factory: VirtualKeyboardFactory
            },
            'fv:definitions': {
                label: intl.trans('definitions', 'Definitions', 'first'),
                item: {
                    fields: {
                        translation: {
                            label: intl.trans('translation', 'Translation', 'first'),
                            factory: VirtualKeyboardFactory
                        },
                        language: {
                            label: intl.trans('language', 'Language', 'first'),
                            factory: SelectFactory,
                            attrs: {
                                defaultValue: 'english',
                                directory: 'fv_language'
                            }
                        }
                    },
                    template: DefinitionsLayout
                },
                help:
                    <i>{intl.trans('models.describe_what_the_word_means', 'Describe what the word actually means.', 'first')}</i>
            },
            'fv:literal_translation': {
                label: intl.trans('literal_translation', 'Literal Translation', 'first'),
                item: {
                    fields: {
                        translation: {
                            label: intl.trans('translation', 'Translation', 'first'),
                            factory: VirtualKeyboardFactory
                        },
                        language: {
                            label: intl.trans('language', 'Language', 'first'),
                            factory: SelectFactory,
                            attrs: {
                                defaultValue: 'english',
                                directory: 'fv_language'
                            }
                        }
                    },
                    template: DefinitionsLayout
                },
                help:
                    <i>{intl.trans('models.describe_what_the_word_translates_to', 'Describe what the word translates to regardless of context.', 'first')}</i>
            },
            'fv-word:part_of_speech': {
                label: intl.trans('views.pages.search.part_of_speech', 'Part of Speech', 'first'),
                factory: SelectFactory,
                attrs: {
                    directory: 'parts_of_speech'
                }
            },
            'fv-word:pronunciation': {
                label: intl.trans('pronunciation', 'Pronunciation', 'first'),
                factory: VirtualKeyboardFactory
            },
            'fv-word:related_phrases': {
                label: intl.trans('views.pages.explore.dialect.learn.words.related_phrases', 'Related Phrases', 'first'),
                item: {
                    factory: SelectSuggestFactory,
                    type: 'FVPhrase'
                }
            },
            'fv-word:categories': {
                label: intl.trans('categories', 'Categories', 'first'),
                item: {
                    factory: SelectSuggestFactory,
                    type: 'FVCategory',
                    attrs: {
                        containerType: 'FVWord',
                        page_provider: {
                            name: 'category_suggestion',
                            folder: 'Categories'
                        },
                        hideCreate: true
                    }
                }
            },
            'fv:related_audio': {
                label: intl.trans('related_audio', 'Related Audio', 'first'),
                item: {
                    factory: MediaFactory,
                    type: 'FVAudio'
                },
                template: RelatedMediaLayout
            },
            'fv:related_pictures': {
                label: intl.trans('related_pictures', 'Related Pictures', 'first'),
                item: {
                    factory: MediaFactory,
                    type: 'FVPicture'
                },
                template: RelatedMediaLayout
            },
            'fv:related_videos': {
                label: intl.trans('related_videos', 'Related Videos', 'first'),
                item: {
                    factory: MediaFactory,
                    type: 'FVVideo'
                },
                template: RelatedMediaLayout
            },
            'fv:cultural_note': {
                label: intl.trans('views.pages.explore.dialect.learn.words.cultural_note', 'Cultural Note', 'first'),
                item: {
                    factory: VirtualKeyboardFactory,
                    type: 'FVVideo'
                }
            },
            'fv:reference': {
                label: intl.trans('reference', 'Reference', 'first'),
                help: <i>{intl.trans('models.origin_of_record', 'Origin of record (person, book, etc)', 'first')}.</i>,
                factory: VirtualKeyboardFactory
            },
            'fv:source': {
                label: intl.trans('source', 'Source', 'first'),
                help:
                    <i>{intl.trans('models.contributors_who_helped', 'Contributor(s) who helped create this record', 'first')}.</i>,
                item: {
                    factory: SelectSuggestFactory,
                    type: 'FVContributor',
                    attrs: {
                        allowEdit: true
                    }
                }
            },
            'fv:available_in_childrens_archive': {
                label: intl.trans('models.available_in_childrens_archive', 'Available in Children\'s Archive', 'first')
            },
            'fv-word:available_in_games': {
                label: intl.trans('models.available_in_games', 'Available in games', 'first')
            }
        },
        i18n: i18nExt
    },
    FVPhrase: {
        order: ['dc:title', 'fv:definitions', 'fv-phrase:phrase_books', 'fv:related_audio', 'fv:related_pictures', 'fv:related_videos', 'fv:cultural_note', 'fv:reference', 'fv:source', 'fv:available_in_childrens_archive'],
        fields: {
            'dc:title': {
                label: intl.trans('phrase', 'Phrase', 'first')
            },
            'fv:definitions': {
                label: intl.trans('definitions', 'Definitions', 'first'),
                item: {
                    fields: {
                        translation: {
                            label: intl.trans('translation', 'Translation', 'first')
                        },
                        language: {
                            label: intl.trans('language', 'Language', 'first'),
                            factory: SelectFactory,
                            attrs: {
                                defaultValue: 'english',
                                directory: 'fv_language'
                            }
                        }
                    },
                    template: DefinitionsLayout
                },
                help:
                    <i>{intl.trans('models.describe_what_the_phrase_means', 'Describe what the phrase actually means.', 'first')}</i>
            },
            'fv-phrase:phrase_books': {
                label: intl.trans('phrase_books', 'Phrase Books', 'first'),
                item: {
                    factory: SelectSuggestFactory,
                    type: 'FVCategory',
                    attrs: {
                        containerType: 'FVPhrase',
                        allowEdit: true,
                        page_provider: {
                            name: 'phrasebook_suggestion',
                            folder: 'Phrase Books'
                        }
                    }
                }
            },
            'fv:related_audio': {
                label: intl.trans('related_audio', 'Related Audio', 'first'),
                item: {
                    factory: MediaFactory,
                    type: 'FVAudio'
                },
                template: RelatedMediaLayout
            },
            'fv:related_pictures': {
                label: intl.trans('related_pictures', 'Related Pictures', 'first'),
                item: {
                    factory: MediaFactory,
                    type: 'FVPicture'
                },
                template: RelatedMediaLayout
            },
            'fv:related_videos': {
                label: intl.trans('related_videos', 'Related Videos', 'first'),
                item: {
                    factory: MediaFactory,
                    type: 'FVVideo'
                },
                template: RelatedMediaLayout
            },
            'fv:cultural_note': {
                label: intl.trans('views.pages.explore.dialect.learn.words.cultural_notes', 'Cultural Notes', 'first')
            },
            'fv:reference': {
                label: intl.trans('reference', 'Reference', 'first'),
                help: <i>{intl.trans('models.origin_of_record', 'Origin of record (person, book, etc)', 'first')}</i>
            },
            'fv:source': {
                label: intl.trans('source', 'Source', 'first'),
                help:
                    <i>{intl.trans('models.contributors_who_helped', 'Contributor(s) who helped create this record.', 'first')}</i>,
                item: {
                    factory: SelectSuggestFactory,
                    type: 'FVContributor'
                }
            },
            'fv:available_in_childrens_archive': {
                label: intl.trans('models.available_in_childrens_archive', 'Available in Children\'s Archive', 'first')
            }
        },
        i18n: i18nExt
    },
    FVBook: {
        order: ['dc:title', 'fvbook:title_literal_translation', 'fvbook:introduction', 'fvbook:introduction_literal_translation', 'fvbook:type', 'fv:related_audio', 'fv:related_pictures', 'fv:related_videos', 'fvbook:author', 'fv:cultural_note', 'fv:source', 'fv:available_in_childrens_archive'],
        fields: {
            'dc:title': {
                label: intl.trans('book_title', 'Book Title', 'first'),
                help: <i>{intl.trans('models.title_of_book', 'The title of the book', 'first')}</i>
            },
            'fvbook:title_literal_translation': {
                label: intl.trans('models.book_title_translation', 'Book Title Translation', 'first'),
                item: {
                    fields: {
                        translation: {
                            label: intl.trans('translation', 'Translation', 'first')
                        },
                        language: {
                            label: intl.trans('language', 'Language', 'first'),
                            factory: SelectFactory,
                            attrs: {
                                defaultValue: 'english',
                                directory: 'fv_language'
                            }
                        }
                    },
                    template: DefinitionsLayout
                },
                help:
                    <i>{intl.trans("models.describe_what_the_title_translates_to", 'Describe what the title translates to regardless of context.', 'first')}</i>
            },
            'fvbook:introduction': {
                label: intl.trans("models.book_introduction", 'Book Introduction', 'first'),
                type: 'textarea',
                factory: WysiwygFactory,
                attrs: {
                    placeholder: intl.trans("models.enter_book_introduction", 'Enter Book Introduction Here', 'first')
                }
            },
            'fvbook:introduction_literal_translation': {
                label: intl.trans("models.introduction_translation", 'Introduction Translation', 'first'),
                item: {
                    fields: {
                        translation: {
                            label: intl.trans("translation", 'Translation', 'first'),
                            type: 'textarea',
                            factory: WysiwygFactory
                        },
                        language: {
                            label: intl.trans("language", 'Language', 'first'),
                            factory: SelectFactory,
                            attrs: {
                                defaultValue: 'english',
                                directory: 'fv_language'
                            }
                        }
                    },
                    template: DefinitionsLayout
                },
                help:
                    <i>{intl.trans('models.describe_what_the_introduction_translates_to', 'Describe what the introduction translates to regardless of context.', 'first')}</i>
            },
            'fvbook:type': {
                label: intl.trans("type", 'Type', 'first'),
                factory: SelectFactory,
                attrs: {
                    directory: 'fv_book_type'
                }
            },
            'fv:related_audio': {
                label: intl.trans("related_audio", 'Related Audio', 'first'),
                item: {
                    factory: MediaFactory,
                    type: 'FVAudio'
                }
            },
            'fv:related_pictures': {
                label: intl.trans("related_pictures", 'Related Pictures', 'first'),
                item: {
                    factory: MediaFactory,
                    type: 'FVPicture'
                }
            },
            'fv:related_videos': {
                label: intl.trans("related_videos", 'Related Videos', 'first'),
                item: {
                    factory: MediaFactory,
                    type: 'FVVideo'
                }
            },
            'fvbook:author': {
                label: intl.trans("author", 'Author', 'first'),
                item: {
                    factory: SelectSuggestFactory,
                    type: 'FVContributor'
                }
            },
            'fv:source': {
                label: intl.trans("source", 'Source', 'first'),
                help:
                    <i>{intl.trans('models.contributors_who_helped', 'Contributor(s) who helped create this record.', 'first')}</i>,
                item: {
                    factory: SelectSuggestFactory,
                    type: 'FVContributor'
                }
            },
            'fv:cultural_note': {
                label: intl.trans('views.pages.explore.dialect.learn.words.cultural_notes', 'Cultural Notes', 'first')
            },
            'fv:available_in_childrens_archive': {
                label: intl.trans('models.available_in_childrens_archive', 'Available in Children\'s Archive', 'first')
            }
        },
        i18n: i18nExt
    },
    FVBookEntry: {
        order: ['dc:title', 'fvbookentry:dominant_language_text', 'fv:literal_translation', 'fv:related_audio', 'fv:related_pictures', 'fv:related_videos', 'fv:cultural_note', 'fv:source'],
        fields: {
            'dc:title': {
                label: intl.trans("models.page_content", 'Page Content', 'first'),
                type: 'textarea',
                factory: WysiwygFactory
            },
            'fvbookentry:dominant_language_text': {
                label: 'Dominant Language Text',
                item: {
                    fields: {
                        translation: {
                            label: intl.trans("translation", 'Translation', 'first'),
                            type: 'textarea'
                        },
                        language: {
                            label: intl.trans("language", 'Language', 'first'),
                            factory: SelectFactory,
                            attrs: {
                                defaultValue: 'english',
                                directory: 'fv_language'
                            }
                        }
                    },
                    template: DefinitionsLayout
                },
                help: <i>{intl.trans('models.page_content_translation', 'Page content translation.', 'first')}</i>
            },
            'fv:literal_translation': {
                label: 'Literal Translation',
                item: {
                    fields: {
                        translation: {
                            label: intl.trans("translation", 'Translation', 'first'),
                            type: 'textarea'
                        },
                        language: {
                            label: intl.trans("language", 'Language', 'first'),
                            factory: SelectFactory,
                            attrs: {
                                defaultValue: 'english',
                                directory: 'fv_language'
                            }
                        }
                    },
                    template: DefinitionsLayout
                },
                help:
                    <i>{intl.trans('models.page_content_translation', 'Describe what the book entry translates to regardless of context.', 'first')}</i>
            },
            'fv:related_audio': {
                label: intl.trans("related_audio", 'Related Audio', 'first'),
                item: {
                    factory: MediaFactory,
                    type: 'FVAudio'
                }
            },
            'fv:related_pictures': {
                label: intl.trans("related_pictures", 'Related Pictures', 'first'),
                item: {
                    factory: MediaFactory,
                    type: 'FVPicture'
                }
            },
            'fv:related_videos': {
                label: intl.trans("related_videos", 'Related Videos', 'first'),
                item: {
                    factory: MediaFactory,
                    type: 'FVVideo'
                }
            },
            'fv:source': {
                label: intl.trans("source", 'Source', 'first'),
                help:
                    <i>{intl.trans('models.contributors_who_helped', 'Contributor(s) who helped create this record.', 'first')}</i>,
                item: {
                    factory: SelectSuggestFactory,
                    type: 'FVContributor'
                }
            },
            'fv:cultural_note': {
                label: intl.trans('views.pages.explore.dialect.learn.words.cultural_notes', 'Cultural Notes', 'first')
            }
        },
        i18n: i18nExt
    },
    FVGallery: {
        order: ['dc:title', 'dc:description', 'fv:related_pictures'],
        fields: {
            'dc:title': {
                label: intl.trans('models.gallery_name', 'Gallery Name', 'first'),
                help: <i>{intl.trans('models.name_of_gallery', 'The Name of the Gallery', 'first')}</i>
            },

            'dc:description': {
                label: intl.trans('models.gallery_description', 'Gallery Description', 'first'),
                type: 'textarea',
                attrs: {
                    placeholder: intl.trans('models.enter_gallery_description', 'Enter gallery description here', 'first')
                }
            },
            'fv:related_pictures': {
                label: intl.trans("related_pictures", 'Related Pictures', 'first'),
                item: {
                    factory: MediaFactory,
                    type: 'FVPicture'
                }
            }
        },
        i18n: i18nExt
    },

    FVCategory: {
        order: ['dc:title', 'dc:description', 'fvcategory:parent_category', 'fvcategory:image'],
        fields: {
            'dc:title': {
                label: intl.trans('models.category_name', 'Category Name', 'first'),
                help: <i>{intl.trans('models.name_of_category', 'The name of the category', 'first')}</i>
            },

            'dc:description': {
                label: intl.trans('models.category_description', 'Category Description', 'first'),
                type: 'textarea',
                attrs: {
                    placeholder: intl.trans('models.enter_category_description', 'Enter category description here', 'first')
                }
            },
            'fvcategory:parent_category': {
                label: intl.trans('models.parent_category_name', 'Parent Category Name', 'first'),
                help: <i>{intl.trans('models.name_of_parent_category', 'The name of the parent category', 'first')}</i>,
                factory: SelectSuggestFactory,
                type: 'FVCategory',
                attrs: {
                    page_provider: {
                        name: 'category_suggestion',
                        folder: 'Categories'
                    },
                    disableCreateNewButton: true
                }
            },
            'fvcategory:image': {
                label: intl.trans('models.category_image', 'Category Image', 'first'),
                factory: MediaFactory,
                type: 'FVPicture'
            }
        },
        i18n: i18nExt
    },

    FVPhraseBook: {
        order: ['dc:title', 'dc:description'],
        fields: {
            'dc:title': {
                label: intl.trans('models.phrase_book_name', 'Phrase Book Name', 'first'),
                help: <i>{intl.trans('models.name_of_phrase_book', 'The name of the phrase book', 'first')}</i>
            },

            'dc:description': {
                label: intl.trans('models.phrase_book_description', 'Phrase Book Description', 'first'),
                type: 'textarea',
                attrs: {
                    placeholder: intl.trans('models.enter_phrase_book_description', 'Enter phrase book description here', 'first')
                }
            }
        },
        i18n: i18nExt
    },

    FVContributor: {
        order: ['dc:title', 'dc:description'],
        fields: {
            'dc:title': {
                label: intl.trans('models.contributor_name', 'Contributor Name', 'first'),
                help: <i>{intl.trans('models.name_of_contributor', 'The name of the contributor', 'first')}</i>
            },

            'dc:description': {
                label: intl.trans('models.contributor_description', 'Contributor Description', 'first'),
                type: 'textarea',
                attrs: {
                    placeholder: intl.trans('models.enter_contributor_description', 'Enter contributor description here', 'first')
                }
            }
        },
        i18n: i18nExt
    },

    FVPortal: {
        fields: {
            'fv-portal:greeting': {
                label: intl.trans('models.portal_greeting', 'Portal Greeting', 'first')
            },
            'fv-portal:featured_audio': {
                label: intl.trans('models.greeting_audio', 'Greeting Audio', 'first'),
                factory: MediaFactory,
                type: 'FVAudio'
            },
            'fv-portal:about': {
                label: intl.trans('models.portal_introduction', 'Portal Introduction', 'first'),
                type: 'textarea',
                factory: WysiwygFactory,
                attrs: {
                    placeholder: intl.trans('models.enter_portal_description', 'Enter portal description here', 'first')
                }
            },
            'fv-portal:news': {
                label: intl.trans('news', 'News', 'first'),
                type: 'textarea',
                factory: WysiwygFactory,
                help: intl.trans('models.news_tip', 'Tip: Use * to start a bullet list!', 'first')
            },
            'fv-portal:background_top_image': {
                label: intl.trans('models.background_image', 'Background Image', 'first'),
                factory: MediaFactory,
                type: 'FVPicture'
            },
            'fv-portal:logo': {
                label: intl.trans('logo', 'Logo', 'first'),
                factory: MediaFactory,
                type: 'FVPicture'
            },
            'fv-portal:featured_words': {
                label: intl.trans('featured_words', 'Featured Words', 'first'),
                item: {
                    factory: SelectSuggestFactory,
                    type: 'FVWord',
                    attrs: {
                        disableCreateNewButton: true,
                        previewProps: {
                            minimal: true
                        }
                    }
                }
            },
            'fv-portal:related_links': {
                label: intl.trans('related_links', 'Related Links', 'first'),
                item: {
                    factory: SelectSuggestFactory,
                    type: 'FVLink',
                    attrs: {
                        previewProps: {
                            minimal: true
                        },
                        allowEdit: true
                    }
                }
            }
        },
        template: FVPortalTemplate,
        i18n: i18nExt
    },

    FVDialect: {
        fields: {
            'dc:title': {
                label: intl.trans('models.dialect_name', 'Dialect Name', 'first'),
                type: 'text'
            },
            'dc:description': {
                label: intl.trans('models.about_dialect', 'About Dialect', 'first'),
                type: 'textarea',
                factory: WysiwygFactory
            },
            'fvdialect:country': {
                label: intl.trans('country', 'Country', 'first'),
                factory: SelectFactory,
                attrs: {
                    fancy: false,
                    directory: 'fv_countries'
                }
            },
            'fvdialect:dominant_language': {
                label: intl.trans('models.dominant_language', 'Dominant Language', 'first'),
                factory: SelectFactory,
                attrs: {
                    fancy: false,
                    directory: 'fv_language'
                }
            },
            'fvdialect:region': {
                label: intl.trans('region', 'Region', 'first'),
                type: 'text'
            },
            'fvdialect:keyboards': {
                label: intl.trans('models.keyboard_links', 'Keyboard Links', 'first'),
                item: {
                    factory: SelectSuggestFactory,
                    type: 'FVLink',
                    attrs: {
                        previewProps: {
                            minimal: true
                        },
                        allowEdit: true
                    }
                }
            },
            'fvdialect:language_resources': {
                label: intl.trans('language_resources', 'Language Resources', 'first'),
                item: {
                    factory: SelectSuggestFactory,
                    type: 'FVLink',
                    attrs: {
                        previewProps: {
                            minimal: true
                        },
                        allowEdit: true
                    }
                }
            },
            'fvdialect:contact_information': {
                label: intl.trans('contact_info', 'Contact Information', 'first'),
                type: 'textarea',
                factory: WysiwygFactory
            }
        },
        i18n: i18nExt
    },

    FVCharacter: {
        fields: {
            'dc:title': {
                label: intl.trans('character', 'Character', 'first'),
                disabled: true
            },
            'fvcharacter:upper_case_character': {
                label: intl.trans('uppercase', 'Uppercase', 'first'),
                disabled: true
            },
            'fvcharacter:alphabet_order': {
                label: intl.trans('models.sort_order', 'Sort Order', 'first'),
                disabled: true
            },
            'fv:related_audio': {
                label: intl.trans("related_audio", 'Related Audio', 'first'),
                item: {
                    factory: MediaFactory,
                    type: 'FVAudio'
                }
            },
            'fvcharacter:related_words': {
                label: intl.trans('featured_words', 'Featured Words', 'first'),
                item: {
                    factory: SelectSuggestFactory,
                    type: 'FVWord',
                    attrs: {
                        disableCreateNewButton: true
                    }
                }
            }
        },
        i18n: i18nExt
    },
    FVAudio: Object.assign({}, FVMedia),
    FVPicture: Object.assign({}, FVMedia),
    FVVideo: Object.assign({}, FVMedia),
    FVResource: FVMedia,
    FVUser: {
        fields: {
            'userinfo:firstName': {
                label: intl.trans("first_name", 'First Name', 'first')
            },
            'userinfo:lastName': {
                label: intl.trans("last_name", 'Last Name', 'first')
            },
            'userinfo:email': {
                label: intl.trans("views.pages.explore.dialect.users.email_address", 'Email Address', 'first')
            },
            'fvuserinfo:requestedSpace': {
                label: intl.translate({
                    key: "models.dialect_to_join",
                    default: 'Dialect to Join',
                }),
                factory: SelectFactory,
                attrs: {
                    query: 'SELECT ecm:uuid, dc:title FROM FVDialect WHERE ecm:path STARTSWITH \'/FV/sections\'',
                    queryId: 'dialect_titles_uids',
                    label: 'Dialect to Join'
                }
            }
        }
    },
    FVUserProfile: {
        fields: {
            'firstName': {
                label: intl.trans("first_name", 'First Name', 'first')
            },
            'lastName': {
                label: intl.trans("last_name", 'Last Name', 'first')
            },
            'email': {
                label: intl.trans("views.pages.explore.dialect.users.email_address", 'Email Address', 'first')
            },
            'preferences': {
                label: intl.trans("preferences", 'Preferences', 'first'),
                fields: {
                    General: {
                        label: intl.trans("models.general_options", 'General Options', 'first'),
                        fields: {
                            primary_dialect: {
                                label: intl.trans("models.my_primary_dialect", 'My Primary Dialect', 'first'),
                                factory: SelectFactory,
                                attrs: {
                                    query: 'SELECT ecm:uuid, dc:title FROM FVDialect WHERE ecm:path STARTSWITH \'/FV/Workspaces\'',
                                    queryId: 'dialect_titles_uids',
                                    label: intl.trans("models.primary_dialect", 'Primary Dialect', 'first'),
                                    help: intl.trans("models.note_if_member_of_only_one_dialect", 'Note: If you are a member of only one dialect, that will be your primary dialect automatically.', 'first')
                                }
                            }
                        }
                    },
                    Navigation: {
                        label: intl.trans('navigation', 'Navigation', 'first') + ' ' + i18nExt.optional,
                        fields: {
                            start_page: {
                                label: intl.trans('start_page', 'Start Page', 'words')
                            }
                        }
                    },
                    Theme: {
                        label: intl.trans('models.theme', 'Theme', 'first') + ' ' + i18nExt.optional,
                        fields: {
                            font_size: {
                                label: intl.trans('font_size', 'Font Size', 'words')
                            }
                        }
                    }
                }
            }
        }
    },
    FVLink: {
        fields: {
            'dc:title': {
                label: intl.trans("title", 'Title', 'first')
            },
            'dc:description': {
                label: intl.trans("description", 'Description', 'first')
            },
            'fvlink:url': {
                label: intl.trans("url", 'URL', 'first'),
                help: intl.trans("models.specify_url_if_linking", 'Specify URL if linking to external or internal links.', 'first')
            }/*,
      'file:content': {
        label: 'File',
        help: 'Optional: For linking directly to a file.',
        type: 'file'
      },*/
        }
    }
};

export default options;