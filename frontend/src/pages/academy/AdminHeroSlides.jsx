import { useEffect, useMemo, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { heroSlidesAPI } from '../../utils/api.js';
import { FiPlus, FiEdit, FiTrash2, FiArrowUp, FiArrowDown, FiRefreshCw } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const initialForm = {
  variant: 'default',
  title: '',
  highlight: '',
  subtitle: '',
  buttonText: '',
  preHeading: '',
  heading: '',
  description: '',
  categories: '',
  primaryCtaLabel: '',
  primaryCtaRoute: '',
  secondaryCtaLabel: '',
  secondaryCtaRoute: '',
  trustBadges: '',
  backgroundImage: '',
  backgroundOverlay: '',
  servicesInput: '',
  positionOption: 'end',
  referenceSlideId: ''
};

const formatServicesField = (services = []) => {
  if (!Array.isArray(services) || services.length === 0) return '';
  return services
    .map((service) => {
      const label = service.label?.trim() || '';
      const description = service.description?.trim() || '';
      const route = service.route?.trim() || '';
      return [label, description, route].filter(Boolean).join(' | ');
    })
    .join('\n');
};

const parseServicesInput = (value) => {
  if (!value) return [];
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label = '', description = '', route = ''] = line.split('|').map((part) => part.trim());
      return {
        label,
        description,
        route
      };
    })
    .filter((service) => service.label && service.route);
};

const AdminHeroSlides = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [slides, setSlides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formState, setFormState] = useState(initialForm);
  const [editingSlideId, setEditingSlideId] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');

  const loadSlides = async () => {
    setIsLoading(true);
    try {
      const response = await heroSlidesAPI.getAll();
      setSlides(response.data.slides || []);
    } catch (error) {
      console.error('Failed to load hero slides', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSlides();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleVariantChange = (e) => {
    const { value } = e.target;
    setFormState((prev) => ({
      ...prev,
      variant: value
    }));
  };

  const resetForm = () => {
    setFormState(initialForm);
    setEditingSlideId(null);
    setStatusMessage('');
  };

  const formatArrayField = (value) =>
    value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

  const buildPayload = () => {
    const payload = {
      variant: formState.variant,
      backgroundImage: formState.backgroundImage || undefined,
      backgroundOverlay: formState.backgroundOverlay || undefined
    };

    if (formState.variant === 'default') {
      payload.title = formState.title;
      payload.highlight = formState.highlight;
      payload.subtitle = formState.subtitle;
      payload.buttonText = formState.buttonText;
    } else if (formState.variant === 'services') {
      payload.title = formState.title;
      payload.subtitle = formState.subtitle;
      payload.description = formState.description;
      payload.services = parseServicesInput(formState.servicesInput);
    } else {
      payload.preHeading = formState.preHeading;
      payload.heading = formState.heading;
      payload.highlight = formState.highlight;
      payload.description = formState.description;
      payload.categories = formatArrayField(formState.categories);
      payload.primaryCtaLabel = formState.primaryCtaLabel;
      payload.primaryCtaRoute = formState.primaryCtaRoute;
      payload.secondaryCtaLabel = formState.secondaryCtaLabel;
      payload.secondaryCtaRoute = formState.secondaryCtaRoute;
      payload.trustBadges = formatArrayField(formState.trustBadges);
    }

    const { positionOption, referenceSlideId } = formState;
    if (positionOption && (positionOption === 'start' || positionOption === 'end')) {
      payload.position = positionOption;
    } else if (positionOption === 'after' && referenceSlideId) {
      payload.position = 'after';
      payload.referenceSlideId = Number(referenceSlideId);
    }

    return payload;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = buildPayload();
      if (editingSlideId) {
        await heroSlidesAPI.update(editingSlideId, payload);
        setStatusMessage('Slide updated successfully.');
      } else {
        await heroSlidesAPI.create(payload);
        setStatusMessage('Slide created successfully.');
      }
      resetForm();
      loadSlides();
    } catch (error) {
      console.error('Failed to save slide', error);
      setStatusMessage('Error saving slide. Please check required fields.');
    }
  };

  const handleEdit = (slide) => {
    setEditingSlideId(slide.id);
    setFormState({
      variant: slide.variant,
      title: slide.title || '',
      highlight: slide.highlight || '',
      subtitle: slide.subtitle || '',
      buttonText: slide.buttonText || '',
      preHeading: slide.preHeading || '',
      heading: slide.heading || '',
      description: slide.description || '',
      categories: Array.isArray(slide.categories) ? slide.categories.join(', ') : '',
      primaryCtaLabel: slide.primaryCtaLabel || '',
      primaryCtaRoute: slide.primaryCtaRoute || '',
      secondaryCtaLabel: slide.secondaryCtaLabel || '',
      secondaryCtaRoute: slide.secondaryCtaRoute || '',
      trustBadges: Array.isArray(slide.trustBadges) ? slide.trustBadges.join(', ') : '',
      servicesInput: formatServicesField(slide.services),
      backgroundImage: slide.backgroundImage || '',
      backgroundOverlay: slide.backgroundOverlay || '',
      positionOption: 'end',
      referenceSlideId: ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this slide?')) return;
    try {
      await heroSlidesAPI.delete(id);
      loadSlides();
    } catch (error) {
      console.error('Failed to delete slide', error);
    }
  };

  const handleMove = async (id, direction) => {
    const index = slides.findIndex((slide) => slide.id === id);
    if (index === -1) return;

    const referenceSlide =
      direction === 'up' ? slides[index - 1] : slides[index + 1];

    if (!referenceSlide) return;

    try {
      await heroSlidesAPI.update(id, {
        position: direction === 'up' ? 'before' : 'after',
        referenceSlideId: referenceSlide.id
      });
      loadSlides();
    } catch (error) {
      console.error('Failed to reorder slides', error);
    }
  };

  const formHeading =
    editingSlideId !== null ? 'Update Hero Slide' : 'Create Hero Slide';

  const cardBg =
    theme === 'dark'
      ? 'bg-dark-card border border-electric-blue/20'
      : 'bg-white border border-gray-200';

  const labelClass =
    theme === 'dark' ? 'text-gray-200' : 'text-gray-700';

  return (
    <div
      className={`min-h-screen ${
        theme === 'dark' ? 'bg-dark-bg text-white' : 'bg-gray-50 text-gray-900'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p
              className={`text-xs tracking-[0.4em] uppercase font-semibold ${
                theme === 'dark' ? 'text-electric-green' : 'text-accent-blue'
              }`}
            >
              Hero Experience
            </p>
            <h1 className="text-3xl font-orbitron font-bold">
              Manage Hero Slides
            </h1>
          </div>
          <button
            className={`px-4 py-2 rounded-full font-semibold flex items-center gap-2 ${
              theme === 'dark'
                ? 'bg-electric-blue/20 text-electric-blue hover:bg-electric-blue/30'
                : 'bg-accent-blue/10 text-accent-blue hover:bg-accent-blue/20'
            }`}
            onClick={() => navigate('/')}
          >
            Preview Site
          </button>
        </div>

        <div className={`rounded-2xl p-6 mb-10 ${cardBg}`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">{formHeading}</h2>
            <div className="flex gap-2">
              <button
                className="px-4 py-2 rounded-full flex items-center gap-2 bg-gray-200 text-gray-800 hover:bg-gray-300"
                onClick={resetForm}
                type="button"
              >
                <FiRefreshCw /> Reset
              </button>
            </div>
          </div>

          {statusMessage && (
            <div
              className={`mb-4 rounded-xl px-4 py-3 text-sm ${
                statusMessage.includes('Error')
                  ? 'bg-red-500/10 text-red-500 border border-red-500/50'
                  : 'bg-green-500/10 text-green-400 border border-green-500/30'
              }`}
            >
              {statusMessage}
            </div>
          )}

          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div>
              <label className={`block mb-2 font-semibold ${labelClass}`}>Slide Variant</label>
              <select
                name="variant"
                value={formState.variant}
                onChange={handleVariantChange}
                className="w-full rounded-xl border px-4 py-3 bg-transparent"
              >
                <option value="default">Default (Hero Intro)</option>
                <option value="showcase">Showcase (HashStudioz style)</option>
                <option value="services">Services (Capability grid)</option>
              </select>
            </div>

            {formState.variant === 'default' && (
              <>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block mb-2 font-semibold ${labelClass}`}>Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formState.title}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border px-4 py-3 bg-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className={`block mb-2 font-semibold ${labelClass}`}>Highlight</label>
                    <input
                      type="text"
                      name="highlight"
                      value={formState.highlight}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border px-4 py-3 bg-transparent"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className={`block mb-2 font-semibold ${labelClass}`}>Subtitle</label>
                  <textarea
                    name="subtitle"
                    value={formState.subtitle}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border px-4 py-3 bg-transparent"
                    rows={3}
                  />
                </div>
                <div>
                  <label className={`block mb-2 font-semibold ${labelClass}`}>Button Text</label>
                  <input
                    type="text"
                    name="buttonText"
                    value={formState.buttonText}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border px-4 py-3 bg-transparent"
                  />
                </div>
              </>
            )}

            {formState.variant === 'showcase' && (
              <>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block mb-2 font-semibold ${labelClass}`}>Pre Heading</label>
                    <input
                      type="text"
                      name="preHeading"
                      value={formState.preHeading}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border px-4 py-3 bg-transparent"
                    />
                  </div>
                  <div>
                    <label className={`block mb-2 font-semibold ${labelClass}`}>Highlight</label>
                    <input
                      type="text"
                      name="highlight"
                      value={formState.highlight}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border px-4 py-3 bg-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className={`block mb-2 font-semibold ${labelClass}`}>Heading</label>
                  <input
                    type="text"
                    name="heading"
                    value={formState.heading}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border px-4 py-3 bg-transparent"
                  />
                </div>
                <div>
                  <label className={`block mb-2 font-semibold ${labelClass}`}>Description</label>
                  <textarea
                    name="description"
                    value={formState.description}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border px-4 py-3 bg-transparent"
                    rows={3}
                  />
                </div>
                <div>
                  <label className={`block mb-2 font-semibold ${labelClass}`}>Categories (comma separated)</label>
                  <input
                    type="text"
                    name="categories"
                    value={formState.categories}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border px-4 py-3 bg-transparent"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block mb-2 font-semibold ${labelClass}`}>Primary CTA Label</label>
                    <input
                      type="text"
                      name="primaryCtaLabel"
                      value={formState.primaryCtaLabel}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border px-4 py-3 bg-transparent"
                    />
                  </div>
                  <div>
                    <label className={`block mb-2 font-semibold ${labelClass}`}>Primary CTA Route</label>
                    <input
                      type="text"
                      name="primaryCtaRoute"
                      value={formState.primaryCtaRoute}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border px-4 py-3 bg-transparent"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block mb-2 font-semibold ${labelClass}`}>Secondary CTA Label</label>
                    <input
                      type="text"
                      name="secondaryCtaLabel"
                      value={formState.secondaryCtaLabel}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border px-4 py-3 bg-transparent"
                    />
                  </div>
                  <div>
                    <label className={`block mb-2 font-semibold ${labelClass}`}>Secondary CTA Route</label>
                    <input
                      type="text"
                      name="secondaryCtaRoute"
                      value={formState.secondaryCtaRoute}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border px-4 py-3 bg-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className={`block mb-2 font-semibold ${labelClass}`}>Trust Badges (comma separated)</label>
                  <input
                    type="text"
                    name="trustBadges"
                    value={formState.trustBadges}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border px-4 py-3 bg-transparent"
                  />
                </div>
              </>
            )}

            {formState.variant === 'services' && (
              <>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block mb-2 font-semibold ${labelClass}`}>Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formState.title}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border px-4 py-3 bg-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className={`block mb-2 font-semibold ${labelClass}`}>Subtitle</label>
                    <input
                      type="text"
                      name="subtitle"
                      value={formState.subtitle}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border px-4 py-3 bg-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className={`block mb-2 font-semibold ${labelClass}`}>Description</label>
                  <textarea
                    name="description"
                    value={formState.description}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border px-4 py-3 bg-transparent"
                    rows={3}
                  />
                </div>
                <div>
                  <label className={`block mb-2 font-semibold ${labelClass}`}>Services (one per line: Label | Description | Route)</label>
                  <textarea
                    name="servicesInput"
                    value={formState.servicesInput}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border px-4 py-3 bg-transparent font-mono text-sm"
                    rows={4}
                    placeholder="Custom Development | Web, mobile & API platforms | /services#custom-development"
                  />
                  <p className="text-xs mt-1 text-gray-500">
                    Description is optional. Leave route as a hash link or full path.
                  </p>
                </div>
              </>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className={`block mb-2 font-semibold ${labelClass}`}>Background Image URL</label>
                <input
                  type="text"
                  name="backgroundImage"
                  placeholder="https://files.yoursite.com/hero-bg.jpg"
                  value={formState.backgroundImage}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border px-4 py-3 bg-transparent"
                />
              </div>
              <div>
                <label className={`block mb-2 font-semibold ${labelClass}`}>Overlay Color</label>
                <input
                  type="text"
                  name="backgroundOverlay"
                  placeholder="rgba(0, 0, 0, 0.65)"
                  value={formState.backgroundOverlay}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border px-4 py-3 bg-transparent"
                />
                <p className="text-xs mt-1 text-gray-500">Supports rgba(), hex, or CSS color tokens.</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className={`block mb-2 font-semibold ${labelClass}`}>Insert Position</label>
                <select
                  name="positionOption"
                  value={formState.positionOption}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border px-4 py-3 bg-transparent"
                >
                  <option value="start">Beginning of slider</option>
                  <option value="after">After another slide</option>
                  <option value="end">End of slider</option>
                </select>
              </div>
              {formState.positionOption === 'after' && (
                <div className="md:col-span-2">
                  <label className={`block mb-2 font-semibold ${labelClass}`}>Reference Slide</label>
                  <select
                    name="referenceSlideId"
                    value={formState.referenceSlideId}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border px-4 py-3 bg-transparent"
                  >
                    <option value="">Select slide</option>
                    {slides.map((slide) => (
                      <option key={slide.id} value={slide.id}>
                        #{slide.orderIndex ?? slide.order_index ?? 0} · {slide.variant === 'default' ? slide.title : slide.heading}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <button
              type="submit"
              className={`mt-4 flex items-center gap-2 justify-center px-6 py-3 rounded-full font-semibold ${
                theme === 'dark'
                  ? 'bg-electric-green text-black hover:glow-green'
                  : 'bg-accent-red text-white hover:glow-red'
              }`}
            >
              <FiPlus />
              {editingSlideId ? 'Update Slide' : 'Create Slide'}
            </button>
          </form>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <div className={cardBg + ' p-6 text-center'}>Loading slides...</div>
          ) : slides.length === 0 ? (
            <div className={cardBg + ' p-6 text-center'}>
              No slides configured yet. Create your first hero slide.
            </div>
          ) : (
            slides.map((slide) => (
              <motion.div
                key={slide.id}
                layout
                className={`rounded-2xl p-6 ${cardBg}`}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p
                      className={`uppercase text-xs tracking-[0.4em] font-semibold ${
                        theme === 'dark' ? 'text-electric-blue' : 'text-accent-blue'
                      }`}
                    >
                      #{slide.orderIndex ?? slide.order_index ?? 0} · {slide.variant}
                    </p>
                    <h3 className="text-2xl font-orbitron font-bold">
                      {slide.variant === 'default' ? slide.title : slide.heading}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {slide.variant === 'default' ? slide.subtitle : slide.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      className="px-4 py-2 rounded-full flex items-center gap-2 bg-gray-200 text-gray-800 hover:bg-gray-300"
                      onClick={() => handleMove(slide.id, 'up')}
                      disabled={(slide.orderIndex ?? slide.order_index ?? 0) === 0}
                    >
                      <FiArrowUp /> Up
                    </button>
                    <button
                      className="px-4 py-2 rounded-full flex items-center gap-2 bg-gray-200 text-gray-800 hover:bg-gray-300"
                      onClick={() => handleMove(slide.id, 'down')}
                      disabled={(slide.orderIndex ?? slide.order_index ?? 0) === slides.length - 1}
                    >
                      <FiArrowDown /> Down
                    </button>
                    <button
                      className="px-4 py-2 rounded-full flex items-center gap-2 bg-blue-500/10 text-blue-400 border border-blue-400/40 hover:bg-blue-500/20"
                      onClick={() => handleEdit(slide)}
                    >
                      <FiEdit /> Edit
                    </button>
                    <button
                      className="px-4 py-2 rounded-full flex items-center gap-2 bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20"
                      onClick={() => handleDelete(slide.id)}
                    >
                      <FiTrash2 /> Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHeroSlides;

